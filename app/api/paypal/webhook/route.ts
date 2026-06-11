import { NextRequest, NextResponse } from "next/server";
import { serviceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Webhook de PayPal para suscripción recurrente Pro.
// Configurar en developer.paypal.com → Webhooks → eventos:
// BILLING.SUBSCRIPTION.ACTIVATED, BILLING.SUBSCRIPTION.CANCELLED, BILLING.SUBSCRIPTION.EXPIRED, PAYMENT.SALE.COMPLETED
// El subscriber.email_address (o custom_id = user id) mapea al perfil.
export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    const type = event.event_type as string;
    const resource = event.resource ?? {};
    const subscriptionId = resource.id;
    const customUserId = resource.custom_id;          // pasar user.id como custom_id en el botón

    const db = serviceClient();
    // custom_id (user.id de Supabase) es el mapeo confiable: configurarlo en el botón/plan.
    // El email del subscriber puede diferir del email de la cuenta, por eso no se usa como fallback.
    const userId = customUserId;

    if (type === "BILLING.SUBSCRIPTION.ACTIVATED" && userId) {
      await db.from("profiles").update({
        plan: "pro",
        paypal_subscription_id: subscriptionId,
        plan_expires_at: null
      }).eq("id", userId);
    }
    if ((type === "BILLING.SUBSCRIPTION.CANCELLED" || type === "BILLING.SUBSCRIPTION.EXPIRED") && subscriptionId) {
      await db.from("profiles").update({ plan: "free" }).eq("paypal_subscription_id", subscriptionId);
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("paypal webhook error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
