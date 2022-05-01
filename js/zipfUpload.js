function getText() {
const textInput = document.getElementById('text-input');
textInput.addEventListener('change', (event) => {
  const fileList = event.target.files;
  console.log(fileList);
  $.ajax({
    type: "POST",
    url: "~/wordCounter.py",
    data: { param: fileList}
  }).done(function( o ) {
     alert("yo");
  });
});
};
