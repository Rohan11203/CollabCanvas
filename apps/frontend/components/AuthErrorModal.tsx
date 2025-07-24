export const AuthErrorModal = ({
  message,
  onConfirm,
}: {
  message: string;
  onConfirm: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 ">
      <div
        className="relative bg-neutral-900 border border-red-500/50 rounded-xl w-full max-w-sm p-6 text-center shadow-2xl shadow-red-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-red-400 mb-4">
          Access Denied
        </h2>
        <p className="text-neutral-300 mb-6">{message}</p>
        <button
          onClick={onConfirm}
          className="w-full font-semibold rounded-lg py-2 transition bg-red-500 hover:bg-red-600 text-white"
        >
          Return to Sign In
        </button>
      </div>
    </div>
  );
};
