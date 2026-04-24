const generateInvoice = (order) => {
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #f3f4f6;">
        <div style="font-weight: 600; color: #1f2937;">${item.name}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; text-align: center; color: #6b7280;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; text-align: right; color: #6b7280;">
        ₹${item.price.toFixed(2)}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: 600; color: #1f2937;">
        ₹${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Invoice - ${order.orderNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; color: #1f2937; background: #fff; }
        .container { max-width: 750px; margin: 0 auto; padding: 40px; }

        /* Header */
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #4f46e5; }
        .brand { font-size: 28px; font-weight: 800; color: #4f46e5; }
        .brand-tagline { font-size: 12px; color: #9ca3af; margin-top: 4px; }
        .invoice-title { text-align: right; }
        .invoice-title h2 { font-size: 22px; font-weight: 700; color: #1f2937; }
        .invoice-title p { font-size: 13px; color: #6b7280; margin-top: 4px; }

        /* Info Grid */
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
        .info-box { background: #f9fafb; border-radius: 12px; padding: 16px; }
        .info-box h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin-bottom: 8px; font-weight: 600; }
        .info-box p { font-size: 13px; color: #374151; line-height: 1.6; }
        .info-box .name { font-weight: 600; font-size: 14px; color: #1f2937; }

        /* Status badges */
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
        .badge-placed { background: #dbeafe; color: #1d4ed8; }
        .badge-delivered { background: #d1fae5; color: #065f46; }
        .badge-cancelled { background: #fee2e2; color: #991b1b; }
        .badge-shipped { background: #ede9fe; color: #5b21b6; }
        .badge-processing { background: #fef3c7; color: #92400e; }
        .badge-success { background: #d1fae5; color: #065f46; }
        .badge-pending { background: #fef3c7; color: #92400e; }

        /* Table */
        .table-container { margin-bottom: 24px; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #4f46e5; color: white; }
        thead th { padding: 14px 12px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        thead th:nth-child(2), thead th:nth-child(3), thead th:nth-child(4) { text-align: center; }
        thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }

        /* Totals */
        .totals { margin-left: auto; width: 280px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #6b7280; border-bottom: 1px solid #f3f4f6; }
        .total-row.final { font-size: 16px; font-weight: 700; color: #1f2937; border-bottom: none; padding-top: 12px; }
        .total-row.shipping-free { color: #059669; font-weight: 600; }

        /* Footer */
        .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center; }
        .footer p { font-size: 12px; color: #9ca3af; line-height: 1.8; }
        .footer .thank-you { font-size: 16px; font-weight: 700; color: #4f46e5; margin-bottom: 8px; }

        /* Print */
        @media print {
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">

        <!-- Header -->
        <div class="header">
          <div>
            <div class="brand">ShopHub</div>
            <div class="brand-tagline">Your trusted ecommerce partner</div>
          </div>
          <div class="invoice-title">
            <h2>INVOICE</h2>
            <p>${order.orderNumber}</p>
            <p style="margin-top: 6px;">
              ${new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="info-grid">
          <!-- Bill To -->
          <div class="info-box">
            <h4>Bill To</h4>
            <p class="name">${order.user?.name || 'Customer'}</p>
            <p>${order.user?.email || ''}</p>
            <p>${order.user?.phone || ''}</p>
          </div>

          <!-- Ship To -->
          <div class="info-box">
            <h4>Ship To</h4>
            <p class="name">${order.shippingAddress.street}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
            <p>PIN: ${order.shippingAddress.pin}</p>
            <p>Phone: ${order.shippingAddress.phone}</p>
          </div>

          <!-- Order Info -->
          <div class="info-box">
            <h4>Order Details</h4>
            <p>
              <strong>Status:</strong>
              <span class="badge badge-${order.status}">${order.status}</span>
            </p>
            <p style="margin-top: 6px;">
              <strong>Payment:</strong>
              <span class="badge badge-${order.paymentStatus}">
                ${order.paymentMethod.toUpperCase()} — ${order.paymentStatus}
              </span>
            </p>
            ${order.trackingNumber ? `
              <p style="margin-top: 6px;">
                <strong>Tracking:</strong> ${order.trackingNumber}
              </p>
            ` : ''}
          </div>

          <!-- Dates -->
          <div class="info-box">
            <h4>Important Dates</h4>
            <p><strong>Order Date:</strong><br/>
              ${new Date(order.createdAt).toLocaleDateString('en-IN')}
            </p>
            ${order.deliveredAt ? `
              <p style="margin-top: 6px;"><strong>Delivered:</strong><br/>
                ${new Date(order.deliveredAt).toLocaleDateString('en-IN')}
              </p>
            ` : ''}
          </div>
        </div>

        <!-- Items Table -->
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align:center">Qty</th>
                <th style="text-align:right">Unit Price</th>
                <th style="text-align:right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div class="totals">
          <div class="total-row">
            <span>Items Total</span>
            <span>₹${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div class="total-row ${order.shippingPrice === 0 ? 'shipping-free' : ''}">
            <span>Shipping</span>
            <span>${order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice.toFixed(2)}`}</span>
          </div>
          <div class="total-row final">
            <span>Grand Total</span>
            <span>₹${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p class="thank-you">Thank you for shopping with ShopHub!</p>
          <p>
            This is a computer generated invoice and does not require a signature.<br/>
            For support, contact us at support@shophub.com | +91 9876543210<br/>
            © ${new Date().getFullYear()} ShopHub. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  // Open in new window and print/download as PDF
  const printWindow = window.open('', '_blank')
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()

  // Auto trigger print dialog
  setTimeout(() => {
    printWindow.print()
  }, 500)
}

export default generateInvoice