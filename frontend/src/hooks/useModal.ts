import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { openModal, closeModal, closeAllModals } from "../store/uiSlice";

// Modal hook for managing modal state
export const useModal = (modalId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector(
    (state: RootState) => state.ui.modals[modalId] || false
  );

  const open = useCallback(() => {
    dispatch(openModal(modalId));
  }, [dispatch, modalId]);

  const close = useCallback(() => {
    dispatch(closeModal(modalId));
  }, [dispatch, modalId]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

// Multiple modals hook
export const useModals = () => {
  const dispatch = useDispatch<AppDispatch>();
  const modals = useSelector((state: RootState) => state.ui.modals);

  const openModalById = useCallback(
    (modalId: string) => {
      dispatch(openModal(modalId));
    },
    [dispatch]
  );

  const closeModalById = useCallback(
    (modalId: string) => {
      dispatch(closeModal(modalId));
    },
    [dispatch]
  );

  const closeAllModalsAction = useCallback(() => {
    dispatch(closeAllModals());
  }, [dispatch]);

  const isModalOpen = useCallback(
    (modalId: string) => {
      return modals[modalId] || false;
    },
    [modals]
  );

  const getOpenModals = useCallback(() => {
    return Object.keys(modals).filter((modalId) => modals[modalId]);
  }, [modals]);

  return {
    modals,
    openModal: openModalById,
    closeModal: closeModalById,
    closeAllModals: closeAllModalsAction,
    isModalOpen,
    getOpenModals,
  };
};

// Confirmation modal hook
export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    type?: "danger" | "warning" | "info";
  }>({
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "info",
  });

  const show = useCallback((modalConfig: typeof config) => {
    setConfig({
      confirmText: "Confirm",
      cancelText: "Cancel",
      type: "info",
      ...modalConfig,
    });
    setIsOpen(true);
  }, []);

  const hide = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    if (config.onConfirm) {
      config.onConfirm();
    }
    hide();
  }, [config.onConfirm, hide]);

  const handleCancel = useCallback(() => {
    if (config.onCancel) {
      config.onCancel();
    }
    hide();
  }, [config.onCancel, hide]);

  return {
    isOpen,
    config,
    show,
    hide,
    handleConfirm,
    handleCancel,
  };
};

// Form modal hook
export const useFormModal = <T = any>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<T | null>(null);
  const [mode, setMode] = useState<"create" | "edit" | "view">("create");

  const openCreate = useCallback(() => {
    setFormData(null);
    setMode("create");
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((data: T) => {
    setFormData(data);
    setMode("edit");
    setIsOpen(true);
  }, []);

  const openView = useCallback((data: T) => {
    setFormData(data);
    setMode("view");
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setFormData(null);
    setMode("create");
  }, []);

  return {
    isOpen,
    formData,
    mode,
    openCreate,
    openEdit,
    openView,
    close,
    isCreateMode: mode === "create",
    isEditMode: mode === "edit",
    isViewMode: mode === "view",
  };
};

// Loading modal hook
export const useLoadingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Loading...");

  const show = useCallback((loadingMessage?: string) => {
    setMessage(loadingMessage || "Loading...");
    setIsOpen(true);
  }, []);

  const hide = useCallback(() => {
    setIsOpen(false);
  }, []);

  const updateMessage = useCallback((newMessage: string) => {
    setMessage(newMessage);
  }, []);

  return {
    isOpen,
    message,
    show,
    hide,
    updateMessage,
  };
};
