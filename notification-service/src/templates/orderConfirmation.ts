export function orderConfirmationTemplate(
  name: string,
  orderId: number,
  amount: number,
) {
  return `<div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 40px">
  <table
    width="600"
    align="center"
    style="background: white; border-radius: 12px; padding: 40px"
  >
    <tr>
      <td align="center">
        <h1 style="color: #2563eb; margin-bottom: 10px">
          Your Order is Confirmed 🎉
        </h1>

        <p style="font-size: 16px; color: #555">
          Hello <strong>{name}</strong>,
        </p>

        <p style="font-size: 16px; color: #555; line-height: 1.6">
          Thank you for shopping with us.
          <br /><br />
          Your order has been successfully confirmed and is being processed.
        </p>

        <table
          style="
            width: 100%;
            margin-top: 30px;
            border-collapse: collapse;
            background: #f8fafc;
          "
        >
          <tr>
            <td style="padding: 12px; font-weight: bold">Order ID</td>
            <td style="padding: 12px">{orderId}</td>
          </tr>

          <tr>
            <td style="padding: 12px; font-weight: bold">Total Amount</td>
            <td style="padding: 12px">₹{amount}</td>
          </tr>

          <tr>
            <td style="padding: 12px; font-weight: bold">Status</td>
            <td style="padding: 12px">Confirmed</td>
          </tr>
        </table>

        <hr style="margin: 40px 0" />

        <p style="color: #777; font-size: 13px">
          If you did not place this order, please ignore this email.
        </p>

        <p style="color: #999; font-size: 12px">© 2026 LocalMart</p>
      </td>
    </tr>
  </table>
</div>`;
}
