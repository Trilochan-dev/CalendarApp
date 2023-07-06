import Swal from 'sweetalert2'

export default function Toastify({ showIcon = false, title = "Success" }) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  if (showIcon) {
    Toast.fire({
      icon: "error",
      title: title,
    });
  } else {
    Toast.fire({
      icon: "success",
      title: title,
    });
  }


  return <></>;
}
