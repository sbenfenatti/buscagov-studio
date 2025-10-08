export async function GET() {
  return Response.json({
    message: "Endpoint criado via Perplexity diretamente no GitHub! 🎉",
    timestamp: new Date().toISOString(),
    status: "success",
    info: "Este arquivo foi criado pelo Perplexity e deployado automaticamente no Vercel"
  });
}