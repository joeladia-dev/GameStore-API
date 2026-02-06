import { useToast } from "../context/ToastContext";
import "../styles/toast.css";

export function Toast() {
  const { toasts, removeToast, confirmDialog, closeConfirm } = useToast();

  const handleConfirm = () => {
    confirmDialog?.onConfirm();
    closeConfirm();
  };

  const handleCancel = () => {
    confirmDialog?.onCancel?.();
    closeConfirm();
  };

  return (
    <>
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-content">
              <span className="toast-icon">
                {toast.type === "success" && "✓"}
                {toast.type === "error" && "✕"}
                {toast.type === "warning" && "⚠"}
                {toast.type === "info" && "ℹ"}
              </span>
              <span className="toast-message">{toast.message}</span>
            </div>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="toast-overlay">
          <div className="toast-confirm-dialog">
            <p className="toast-confirm-message">{confirmDialog.message}</p>
            <div className="toast-confirm-actions">
              <button
                onClick={handleConfirm}
                className="toast-confirm-btn primary"
              >
                Confirm
              </button>
              <button onClick={handleCancel} className="toast-confirm-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
