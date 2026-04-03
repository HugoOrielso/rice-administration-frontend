interface CheckoutResultadoPageProps {
  searchParams: Promise<{
    id?: string;
    reference?: string;
  }>;
}

export default async function CheckoutResultadoPage({
  searchParams,
}: CheckoutResultadoPageProps) {
  const params = await searchParams;

  const transactionId = params.id;
  const reference = params.reference;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold">Resultado del pago</h1>

      <div className="mt-6 space-y-2 rounded-lg border p-4">
        <p>
          <strong>Transacción:</strong> {transactionId || "No recibida"}
        </p>
        <p>
          <strong>Referencia:</strong> {reference || "No recibida"}
        </p>
      </div>
    </main>
  );
}