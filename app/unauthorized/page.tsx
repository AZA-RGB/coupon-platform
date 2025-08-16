export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-red-600">غير مصرح</h1>
      <p className="mt-4 text-lg">ليس لديك صلاحية للوصول إلى هذه الصفحة.</p>
      <a href="/auth/login" className="mt-6 text-blue-600 hover:underline">العودة إلى تسجيل الدخول</a>
    </div>
  );
}