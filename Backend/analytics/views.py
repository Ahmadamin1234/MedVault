from datetime import timedelta
from decimal import Decimal

from django.db.models import Count, Sum, F
from django.utils import timezone

from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import AnalyticsAccess
from billing.models import Sale, SaleItem
from inventory.models import Medication


# ============================================================
# MONEY FORMAT
# ============================================================

def money(value):
    value = value or Decimal("0.00")
    return f"${value:.2f}"


# ============================================================
# MONTHLY REVENUE + COGS
# ============================================================

def get_monthly_series(sales):

    today = timezone.localdate()

    months = []

    for offset in range(5, -1, -1):

        # ----------------------------------------------------
        # CURRENT MONTH START
        # ----------------------------------------------------

        month_start = (
            today.replace(day=1)
            - timedelta(days=offset * 31)
        ).replace(day=1)

        # ----------------------------------------------------
        # NEXT MONTH
        # ----------------------------------------------------

        if month_start.month == 12:

            next_month = month_start.replace(
                year=month_start.year + 1,
                month=1,
                day=1,
            )

        else:

            next_month = month_start.replace(
                month=month_start.month + 1,
                day=1,
            )

        # ----------------------------------------------------
        # SALES FOR THIS MONTH
        # ----------------------------------------------------

        month_sales = sales.filter(
            created_at__date__gte=month_start,
            created_at__date__lt=next_month,
        )

        # ----------------------------------------------------
        # REVENUE
        # ----------------------------------------------------

        revenue = (
            month_sales.aggregate(
                total=Sum("grand_total")
            )["total"]
            or Decimal("0.00")
        )

        # ----------------------------------------------------
        # COGS
        #
        # Actual batch cost used during sale
        # ----------------------------------------------------

        month_items = (
            SaleItem.objects
            .filter(
                sale__in=month_sales
            )
            .prefetch_related(
                "batch_allocations"
            )
        )

        cogs = Decimal("0.00")

        for sale_item in month_items:

            for allocation in sale_item.batch_allocations.all():

                cogs += (
                    allocation.quantity
                    * allocation.unit_cost
                )

        months.append({

            "label": month_start.strftime(
                "%b %Y"
            ),

            "revenue": float(revenue),

            "cogs": float(cogs),
        })

    return months


# ============================================================
# SALES BY CATEGORY
# ============================================================

def get_category_sales(sales):

    rows = (
        SaleItem.objects
        .filter(
            sale__in=sales
        )
        .values(
            "medication__category"
        )
        .annotate(
            revenue=Sum("line_total")
        )
        .order_by("-revenue")
    )

    total = sum(
        row["revenue"] or Decimal("0.00")
        for row in rows
    )

    if total <= 0:
        total = Decimal("1.00")

    return [

        {
            "name": (
                row["medication__category"]
                or "Uncategorized"
            ),

            "percentage": round(
                (
                    row["revenue"]
                    or Decimal("0.00")
                )
                / total
                * 100
            ),
        }

        for row in rows[:5]
    ]


# ============================================================
# CATEGORY PERFORMANCE
#
# Used by:
# PerformanceGrids.jsx
#
# Returns:
#
# {
#     category,
#     q1,
#     q2,
#     sparkPath
# }
# ============================================================

def get_category_performance(sales):

    today = timezone.localdate()

    year = today.year

    # --------------------------------------------------------
    # QUARTER DATE RANGES
    # --------------------------------------------------------

    q1_start = today.replace(
        year=year,
        month=1,
        day=1,
    )

    q2_start = today.replace(
        year=year,
        month=4,
        day=1,
    )

    q3_start = today.replace(
        year=year,
        month=7,
        day=1,
    )

    # --------------------------------------------------------
    # TOP CATEGORIES
    #
    # Get categories from all current-year sales.
    # --------------------------------------------------------

    category_rows = (
        SaleItem.objects
        .filter(
            sale__in=sales
        )
        .values(
            "medication__category"
        )
        .annotate(
            revenue=Sum("line_total")
        )
        .order_by("-revenue")[:5]
    )

    performance = []

    for row in category_rows:

        category = (
            row["medication__category"]
            or "Uncategorized"
        )

        # ----------------------------------------------------
        # Q1 REVENUE
        # ----------------------------------------------------

        q1_revenue = (
            SaleItem.objects
            .filter(
                sale__in=sales,
                medication__category=category,
                sale__created_at__date__gte=q1_start,
                sale__created_at__date__lt=q2_start,
            )
            .aggregate(
                total=Sum("line_total")
            )["total"]
            or Decimal("0.00")
        )

        # ----------------------------------------------------
        # Q2 REVENUE
        # ----------------------------------------------------

        q2_revenue = (
            SaleItem.objects
            .filter(
                sale__in=sales,
                medication__category=category,
                sale__created_at__date__gte=q2_start,
                sale__created_at__date__lt=q3_start,
            )
            .aggregate(
                total=Sum("line_total")
            )["total"]
            or Decimal("0.00")
        )

        # ----------------------------------------------------
        # CREATE SMALL SPARKLINE
        #
        # Frontend expects SVG path.
        # ----------------------------------------------------

        q1_value = float(q1_revenue)
        q2_value = float(q2_revenue)

        if q1_value == 0 and q2_value == 0:

            spark_path = (
                "M 0 10 "
                "C 15 10, 30 10, 45 10 "
                "S 55 10, 60 10"
            )

        elif q2_value >= q1_value:

            spark_path = (
                "M 0 15 "
                "C 15 14, 25 10, 35 11 "
                "S 50 6, 60 4"
            )

        else:

            spark_path = (
                "M 0 4 "
                "C 15 5, 25 10, 35 9 "
                "S 50 14, 60 16"
            )

        performance.append({

            "category": category,

            "q1": money(q1_revenue),

            "q2": money(q2_revenue),

            "sparkPath": spark_path,
        })

    return performance


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
            stock_quantity__lte=F("reorder_level"),
            stock_quantity__gt=0,
        )

        # ====================================================
        # OUT OF STOCK
        # ====================================================

        out_of_stock = medications.filter(
            stock_quantity=0
        )

        # ====================================================
        # EXPIRING MEDICATIONS
        #
        # Expiry belongs to MedicationBatch.
        # ====================================================

        expiry_limit = (
            today + timedelta(days=90)
        )

        expiring_medications = (
            Medication.objects
            .filter(
                batches__expiry_date__gte=today,
                batches__expiry_date__lte=expiry_limit,
                batches__quantity_remaining__gt=0,
            )
            .distinct()
        )

        # ====================================================
        # TODAY'S SALES
        # ====================================================

        today_sales = (
            sales
            .filter(
                created_at__date=today
            )
            .aggregate(
                total=Sum("grand_total")
            )["total"]
            or Decimal("0.00")
        )

        # ====================================================
        # CATEGORY DISTRIBUTION
        # ====================================================

        categories = (
            medications
            .values("category")
            .annotate(
                total=Count("id")
            )
            .order_by("-total")
        )

        category_total = sum(
            item["total"]
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
                "items__medication"
            )[:5]
        )

        billing = []

        for sale in recent_sales:

            item = sale.items.first()

            billing.append({

                "id": sale.id,

                "name": (
                    item.medication.name
                    if item
                    else "Sale"
                ),

                "qty": (
                    f"{item.quantity} Units"
                    if item
                    else "0 Units"
                ),

                "user": (
                    sale.customer_name
                    or "Walk-in Customer"
                ),

                "price": money(
                    sale.grand_total
                ),

                "time": sale.created_at.strftime(
                    "%I:%M %p"
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
                    item.stock_quantity
                    / reorder_level
                    * 100
                )
            )

            low_stock_rows.append({

                "id": item.id,

                "name": item.name,

                "info": (
                    f"Stock: {item.stock_quantity} / "
                    f"Min Reorder: {item.reorder_level}"
                ),

                "pct": f"{percentage}%",

                "color": (
                    "bg-amber-400 "
                    "text-amber-700 "
                    "bg-amber-50"
                ),
            })

        # ====================================================
        # RESPONSE
        # ====================================================

        return Response({

            # =================================================
            # STAT CARDS
            # =================================================

            "stats": [

                {
                    "title": "Total Drugs In Catalog",

                    "value": medications.count(),

                    "subtext": "Live database count",

                    "color": "text-emerald-600",

                    "bg": "bg-emerald-50",

                    "icon": "Package",

                    "badgeColor": "text-emerald-500",
                },

                {
                    "title": "Low Stock Alerts",

                    "value": low_stock.count(),

                    "subtext": (
                        "Items below reorder level"
                    ),

                    "color": "text-amber-600",

                    "bg": "bg-amber-50",

                    "icon": "AlertTriangle",

                    "badgeColor": "text-amber-500",
                },

                {
                    "title": "Expiring Soon",

                    "value": (
                        expiring_medications.count()
                    ),

                    "subtext": (
                        "Within the next 90 days"
                    ),

                    "color": "text-rose-600",

                    "bg": "bg-rose-50",

                    "icon": "Clock",

                    "badgeColor": "text-rose-400",
                },

                {
                    "title": "Today's Sales",

                    "value": money(
                        today_sales
                    ),

                    "subtext": (
                        "Completed sales today"
                    ),

                    "color": "text-blue-600",

                    "bg": "bg-blue-50",

                    "icon": "DollarSign",

                    "badgeColor": "text-emerald-500",
                },
            ],

            # =================================================
            # INVENTORY CATEGORY DISTRIBUTION
            # =================================================

            "categories": [

                {
                    "name": (
                        item["category"]
                        or "Uncategorized"
                    ),

                    "percentage": (
                        f"{round(
                            item['total']
                            / category_total
                            * 100
                        )}%"
                    ),

                    "color": "bg-teal-600",
                }

                for item in categories[:5]
            ],

            # =================================================
            # RECENT BILLING
            # =================================================

            "billing": billing,

            # =================================================
            # LOW STOCK
            # =================================================

            "lowStock": low_stock_rows,

            # =================================================
            # OUT OF STOCK
            # =================================================

            "outOfStock": out_of_stock.count(),

            # =================================================
            # REVENUE TREND
            # =================================================

            "revenueTrend": get_monthly_series(
                sales
            ),

            # =================================================
            # SALES BY CATEGORY
            # =================================================

            "salesByCategory": get_category_sales(
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
        # CURRENT YEAR SALE ITEMS
        # ====================================================

        items = (
            SaleItem.objects
            .filter(
                sale__in=sales
            )
            .prefetch_related(
                "batch_allocations"
            )
        )

        # ====================================================
        # TOTAL REVENUE
        # ====================================================

        revenue = (
            sales.aggregate(
                total=Sum("grand_total")
            )["total"]
            or Decimal("0.00")
        )

        # ====================================================
        # TOTAL COGS
        # ====================================================

        cost = Decimal("0.00")

        for item in items:

            for allocation in (
                item.batch_allocations.all()
            ):

                cost += (
                    allocation.quantity
                    * allocation.unit_cost
                )

        # ====================================================
        # UNITS SOLD
        # ====================================================

        units = (
            items.aggregate(
                total=Sum("quantity")
            )["total"]
            or 0
        )

        # ====================================================
        # TOP SELLING MEDICATIONS
        # ====================================================

        top = (
            items
            .values(
                "medication__name"
            )
            .annotate(
                units=Sum("quantity")
            )
            .order_by("-units")[:5]
        )

        max_units = (
            top[0]["units"]
            if top
            else 1
        )

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

            profit_margin = Decimal("0.00")

        # ====================================================
        # AVERAGE ORDER VALUE
        # ====================================================

        sale_count = sales.count()

        if sale_count > 0:

            average_order_value = (
                revenue / sale_count
            )

        else:

            average_order_value = Decimal(
                "0.00"
            )

        # ====================================================
        # CATEGORY PERFORMANCE
        #
        # IMPORTANT:
        # This now matches PerformanceGrids.jsx
        # ====================================================

      # ====================================================
# PAYMENT PERFORMANCE
# ====================================================

        payment_performance = (
        sales
    .values("payment_method")
    .annotate(
        transactions=Count("id"),
        revenue=Sum("grand_total")
    )
    .order_by("-revenue")
)

        performance_data = [

    {
        "method": (
            row["payment_method"]
            or "Unspecified"
        ),

        "transactions": row["transactions"],

        "revenue": money(
            row["revenue"]
        ),
    }

            for row in payment_performance
]
        # ====================================================
        # RESPONSE
        # ====================================================

        return Response({

            # =================================================
            # SUMMARY CARDS
            # =================================================

            "summary": [

                {
                    "title": "Net Revenue YTD",

                    "value": money(
                        revenue
                    ),

                    "change": (
                        f"{sale_count} "
                        "completed sales"
                    ),

                    "isPositive": True,
                },

                {
                    "title": "Gross Profit Margin",

                    "value": (
                        f"{profit_margin:.1f}%"
                    ),

                    "change": (
                        f"Cost of goods "
                        f"{money(cost)}"
                    ),

                    "isPositive": (
                        revenue >= cost
                    ),
                },

                {
                    "title": "Units Dispensed YTD",

                    "value": f"{units:,}",

                    "change": (
                        "From completed sales"
                    ),

                    "isPositive": True,

                    "isTarget": True,
                },

                {
                    "title": "Avg Order Value (AOV)",

                    "value": money(
                        average_order_value
                    ),

                    "change": (
                        "Across completed sales"
                    ),

                    "isPositive": True,
                },
            ],

            # =================================================
            # TOP SELLING
            # =================================================

            "topSelling": [

                {
                    "name": (
                        item["medication__name"]
                        or "Unknown"
                    ),

                    "units": item["units"],

                    "percentage": (
                        f"{round(
                            item["units"]
                            / max_units
                            * 100
                        )}%"
                    ),
                }

                for item in top
            ],

            # =================================================
            # CATEGORY PERFORMANCE
            # =================================================

            "performance": performance_data,

            # =================================================
            # REVENUE TREND
            # =================================================

            "revenueTrend": get_monthly_series(
                sales
            ),

            # =================================================
            # SALES BY CATEGORY
            # =================================================

            "salesByCategory": get_category_sales(
                sales
            ),
        })