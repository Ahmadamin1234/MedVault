from datetime import timedelta
from decimal import Decimal

from django.db.models import Count, Sum, F
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import AnalyticsAccess
from billing.models import Sale, SaleItem
from inventory.models import Medication
from orders.models import MedicationBatch


# ============================================================
# MONEY FORMAT
# ============================================================

def money(value):
    return f'${(value or Decimal("0.00")):.2f}'


# ============================================================
# MONTHLY REVENUE + COGS
# ============================================================

def get_monthly_series(sales):
    today = timezone.localdate()

    months = []

    for offset in range(5, -1, -1):

        # Find month start
        month_start = (
            today.replace(day=1)
            - timedelta(days=offset * 31)
        ).replace(day=1)

        # Find next month
        if month_start.month == 12:
            next_month = month_start.replace(
                year=month_start.year + 1,
                month=1
            )
        else:
            next_month = month_start.replace(
                month=month_start.month + 1
            )

        # ----------------------------------------------------
        # SALES FOR THIS MONTH
        # ----------------------------------------------------

        month_sales = sales.filter(
            created_at__date__gte=month_start,
            created_at__date__lt=next_month
        )

        revenue = (
            month_sales.aggregate(
                total=Sum('grand_total')
            )['total']
            or Decimal('0.00')
        )

        # ----------------------------------------------------
        # COGS
        #
        # SaleItemBatch contains the actual batch cost
        # used during the sale.
        # ----------------------------------------------------

        month_sale_items = SaleItem.objects.filter(
            sale__in=month_sales
        ).prefetch_related(
            'batch_allocations'
        )

        cogs = Decimal('0.00')

        for sale_item in month_sale_items:

            for allocation in sale_item.batch_allocations.all():

                cogs += (
                    allocation.quantity *
                    allocation.unit_cost
                )

        months.append({
            'label': month_start.strftime('%b %Y'),
            'revenue': float(revenue),
            'cogs': float(cogs),
        })

    return months


# ============================================================
# SALES BY CATEGORY
# ============================================================

def get_category_sales(sales):

    rows = (
        SaleItem.objects
        .filter(sale__in=sales)
        .values('medication__category')
        .annotate(
            revenue=Sum('line_total')
        )
        .order_by('-revenue')
    )

    total = sum(
        row['revenue'] or Decimal('0.00')
        for row in rows
    )

    if total <= 0:
        total = Decimal('1.00')

    return [
        {
            'name': (
                row['medication__category']
                or 'Uncategorized'
            ),
            'percentage': round(
                (row['revenue'] or Decimal('0.00'))
                / total
                * 100
            ),
        }
        for row in rows[:5]
    ]


# ============================================================
# DASHBOARD
# ============================================================

class DashboardView(APIView):

    permission_classes = [
        AnalyticsAccess
    ]

    def get(self, request):

        today = timezone.localdate()

        # ====================================================
        # CURRENT YEAR SALES
        # ====================================================

        sales = Sale.objects.filter(
            created_at__year=today.year
        )

        # ====================================================
        # MEDICATIONS
        # ====================================================

        medications = Medication.objects.all()

        # ====================================================
        # LOW STOCK
        # ====================================================

        low_stock = medications.filter(
            stock_quantity__lte=F('reorder_level'),
            stock_quantity__gt=0
        )

        # ====================================================
        # OUT OF STOCK
        # ====================================================

        out_of_stock = medications.filter(
            stock_quantity=0
        )

        # ====================================================
        # EXPIRING BATCHES
        #
        # IMPORTANT:
        # expiry_date belongs to MedicationBatch,
        # NOT Medication.
        # ====================================================

        expiry_limit = today + timedelta(days=90)

        expiring_medications = Medication.objects.filter(
    batches__expiry_date__gte=today,
    batches__expiry_date__lte=today + timedelta(days=90),
    batches__quantity_remaining__gt=0
).distinct()

        # ====================================================
        # TODAY SALES
        # ====================================================

        today_sales = (
            sales
            .filter(
                created_at__date=today
            )
            .aggregate(
                total=Sum('grand_total')
            )['total']
            or Decimal('0.00')
        )

        # ====================================================
        # CATEGORY DISTRIBUTION
        # ====================================================

        categories = (
            medications
            .values('category')
            .annotate(
                total=Count('id')
            )
            .order_by('-total')
        )

        category_total = sum(
            item['total']
            for item in categories
        )

        if category_total == 0:
            category_total = 1

        # ====================================================
        # RECENT BILLING
        # ====================================================

        recent_sales = (
            sales
            .prefetch_related(
                'items__medication'
            )[:5]
        )

        billing = []

        for sale in recent_sales:

            item = sale.items.first()

            billing.append({
                'id': sale.id,

                'name': (
                    item.medication.name
                    if item
                    else 'Sale'
                ),

                'qty': (
                    f'{item.quantity} Units'
                    if item
                    else '0 Units'
                ),

                'user': (
                    sale.customer_name
                    or 'Walk-in Customer'
                ),

                'price': money(
                    sale.grand_total
                ),

                'time': sale.created_at.strftime(
                    '%I:%M %p'
                ),
            })

        # ====================================================
        # LOW STOCK ROWS
        # ====================================================

        low_stock_rows = []

        for item in low_stock[:5]:

            reorder_level = max(
                item.reorder_level,
                1
            )

            percentage = min(
                100,
                round(
                    item.stock_quantity /
                    reorder_level *
                    100
                )
            )

            low_stock_rows.append({

                'id': item.id,

                'name': item.name,

                'info': (
                    f'Stock: {item.stock_quantity} / '
                    f'Min Reorder: {item.reorder_level}'
                ),

                'pct': f'{percentage}%',

                'color': (
                    'bg-amber-400 '
                    'text-amber-700 '
                    'bg-amber-50'
                ),
            })

        # ====================================================
        # RETURN DASHBOARD
        # ====================================================

        return Response({

            # =================================================
            # DASHBOARD STAT CARDS
            # =================================================

            'stats': [

                {
                    'title': 'Total Drugs In Catalog',

                    'value': medications.count(),

                    'subtext': 'Live database count',

                    'color': 'text-emerald-600',

                    'bg': 'bg-emerald-50',

                    'icon': 'Package',

                    'badgeColor': 'text-emerald-500',
                },

                {
                    'title': 'Low Stock Alerts',

                    'value': low_stock.count(),

                    'subtext': (
                        'Items below reorder level'
                    ),

                    'color': 'text-amber-600',

                    'bg': 'bg-amber-50',

                    'icon': 'AlertTriangle',

                    'badgeColor': 'text-amber-500',
                },

                {
                    'title': 'Expiring Soon',

                    'value': expiring_medications.count(),

                    'subtext': (
                        'Within the next 90 days'
                    ),

                    'color': 'text-rose-600',

                    'bg': 'bg-rose-50',

                    'icon': 'Clock',

                    'badgeColor': 'text-rose-400',
                },

                {
                    'title': "Today's Sales",

                    'value': money(today_sales),

                    'subtext': (
                        'Completed sales today'
                    ),

                    'color': 'text-blue-600',

                    'bg': 'bg-blue-50',

                    'icon': 'DollarSign',

                    'badgeColor': 'text-emerald-500',
                },
            ],

            # =================================================
            # INVENTORY CATEGORY DISTRIBUTION
            # =================================================

          'categories': [
    {
        'name': item['category'] or 'Uncategorized',

        'percentage': (
            f"{round(item['total'] / category_total * 100)}%"
        ),

        'color': 'bg-teal-600',
    }

    for item in categories[:5]
],

            # =================================================
            # RECENT BILLING
            # =================================================

            'billing': billing,

            # =================================================
            # LOW STOCK
            # =================================================

            'lowStock': low_stock_rows,

            # =================================================
            # OUT OF STOCK
            # =================================================

            'outOfStock': out_of_stock.count(),

            # =================================================
            # REVENUE TREND
            # =================================================

            'revenueTrend': get_monthly_series(
                sales
            ),

            # =================================================
            # SALES BY CATEGORY
            # =================================================

            'salesByCategory': get_category_sales(
                sales
            ),
        })


# ============================================================
# REPORTS
# ============================================================

class ReportsView(APIView):

    permission_classes = [
        AnalyticsAccess
    ]

    def get(self, request):

        today = timezone.localdate()

        # ====================================================
        # CURRENT YEAR SALES
        # ====================================================

        sales = Sale.objects.filter(
            created_at__year=today.year
        )

        # ====================================================
        # ONLY ITEMS FROM CURRENT YEAR SALES
        # ====================================================

        items = (
            SaleItem.objects
            .filter(
                sale__in=sales
            )
            .prefetch_related(
                'batch_allocations'
            )
        )

        # ====================================================
        # REVENUE
        # ====================================================

        revenue = (
            sales.aggregate(
                total=Sum('grand_total')
            )['total']
            or Decimal('0.00')
        )

        # ====================================================
        # COST OF GOODS
        # ====================================================

        cost = Decimal('0.00')

        for item in items:

            for allocation in (
                item.batch_allocations.all()
            ):

                cost += (
                    allocation.quantity *
                    allocation.unit_cost
                )

        # ====================================================
        # UNITS SOLD
        # ====================================================

        units = (
            items.aggregate(
                total=Sum('quantity')
            )['total']
            or 0
        )

        # ====================================================
        # TOP SELLING MEDICATIONS
        # ====================================================

        top = (
            items
            .values(
                'medication__name'
            )
            .annotate(
                units=Sum('quantity')
            )
            .order_by('-units')[:5]
        )

        max_units = (
            top[0]['units']
            if top
            else 1
        )

        # ====================================================
        # PAYMENT PERFORMANCE
        # ====================================================

        payment_performance = (
            sales
            .values('payment_method')
            .annotate(
                count=Count('id'),
                total_revenue=Sum(
                    'grand_total'
                )
            )
            .order_by('-total_revenue')
        )

        performance_data = [

            {
                'metric': (
                    row['payment_method']
                    or 'Unspecified'
                ),

                'volume': (
                    f"{row['count']} transactions"
                ),

                'value': money(
                    row['total_revenue']
                ),
            }

            for row in payment_performance
        ]

        # ====================================================
        # PROFIT MARGIN
        # ====================================================

        if revenue > 0:

            profit_margin = (
                (revenue - cost)
                / revenue
                * 100
            )

        else:

            profit_margin = Decimal('0.00')

        # ====================================================
        # AVERAGE ORDER VALUE
        # ====================================================

        sale_count = sales.count()

        if sale_count > 0:

            average_order_value = (
                revenue /
                sale_count
            )

        else:

            average_order_value = (
                Decimal('0.00')
            )

        # ====================================================
        # RESPONSE
        # ====================================================

        return Response({

            'summary': [

                {
                    'title': 'Net Revenue YTD',

                    'value': money(
                        revenue
                    ),

                    'change': (
                        f'{sale_count} '
                        'completed sales'
                    ),

                    'isPositive': True,
                },

                {
                    'title': 'Gross Profit Margin',

                    'value': (
                        f'{profit_margin:.1f}%'
                    ),

                    'change': (
                        f'Cost of goods '
                        f'{money(cost)}'
                    ),

                    'isPositive': (
                        revenue >= cost
                    ),
                },

                {
                    'title': 'Units Dispensed YTD',

                    'value': f'{units:,}',

                    'change': (
                        'From completed sales'
                    ),

                    'isPositive': True,

                    'isTarget': True,
                },

                {
                    'title': 'Avg Order Value (AOV)',

                    'value': money(
                        average_order_value
                    ),

                    'change': (
                        'Across completed sales'
                    ),

                    'isPositive': True,
                },
            ],

           'topSelling': [
    {
        'name': item['medication__name'],

        'units': item['units'],

        'percentage': (
            f"{round(item['units'] / max_units * 100)}%"
        ),
    }

    for item in top
],
            'performance': performance_data,

            'revenueTrend': get_monthly_series(
                sales
            ),

            'salesByCategory': get_category_sales(
                sales
            ),
        })