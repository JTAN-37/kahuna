def fmt_price(v):
    if v is None:
        return "N/A"
    return f"${v:,.2f}"


def fmt_cap(v):
    if v is None:
        return "N/A"
    if v >= 1e12:
        return f"${v/1e12:.2f}T"
    if v >= 1e9:
        return f"${v/1e9:.2f}B"
    if v >= 1e6:
        return f"${v/1e6:.2f}M"
    return f"${v:,.0f}"


def fmt_pe(v):
    if v is None:
        return "N/A"
    return f"{v:.2f}x"


def register_filters(app):
    app.add_template_filter(fmt_price, "fmt_price")
    app.add_template_filter(fmt_cap, "fmt_cap")
    app.add_template_filter(fmt_pe, "fmt_pe")
