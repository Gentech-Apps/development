export function getModalProps({
  title,
  form,
  onClose,
  submitLabel = 'Save',
  submitLabelDelete = '',
  submitIcon = 'fas fa-save',
  component,
  onSubmitClick,
  isModal = true,
  maxWidth = 'sm',
  fullWidth = false,
}) {
  return {
    title,
    component,
    maxWidth,
    fullWidth,
    isModal,
    onSubmitClick,
    submitLabelDelete,
    submitIcon,
    submitLabel,
    onClose,
    form,
  };
}
