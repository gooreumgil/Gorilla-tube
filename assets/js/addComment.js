import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const deleteSubmitBtn = document.getElementsByClassName("deleteSubmit");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = async comment => {
  try {
    const li = document.createElement("li");
    const deleteForm = document.createElement("form");
    const deleteButton = document.createElement("button");
    deleteButton.className = "deleteSubmit";
    deleteButton.setAttribute("type", "button");
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-times");
    deleteIcon.id = "comment-delete";
    const idSendInput = document.createElement("input");
    idSendInput.setAttribute("type", "text");
    idSendInput.setAttribute("name", "commentId");
    idSendInput.setAttribute("value", `${comment.id}`);
    const avatardiv = document.createElement("div");
    avatardiv.className = "avatar";
    avatardiv.style.backgroundImage = `url('${comment.avatarUrl}')`;
    const infoDiv = document.createElement("div");
    infoDiv.className = "user-info";
    const nameSpan = document.createElement("span");
    nameSpan.className = "user-name";
    nameSpan.innerHTML = comment.name;
    const textSpan = document.createElement("span");
    textSpan.className = "text";

    textSpan.innerHTML = comment.text;

    commentList.prepend(li);
    li.appendChild(deleteForm);
    li.appendChild(avatardiv);
    li.appendChild(infoDiv);
    infoDiv.prepend(textSpan);
    infoDiv.prepend(nameSpan);
    deleteForm.appendChild(deleteButton);
    deleteButton.appendChild(deleteIcon);
    deleteIcon.appendChild(idSendInput);
    increaseNumber();
  } catch (error) {
    console.log(error);
  }
};

const sendComment = async text => {
  const videoId = window.location.href.split("/video/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      text
    }
  });

  const comment = {
    text,
    avatarUrl: response.data.avatarUrl,
    name: response.data.name,
    id: response.data.id
  };

  console.log(comment.id);

  comment.avatarUrl = comment.avatarUrl.split("\\").join("/");

  if (response.status === 200) {
    addComment(comment);
  }
};

const handleSubmit = event => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const text = commentInput.value;
  sendComment(text);
  commentInput.value = "";
};

const handleDelete = async event => {
  const icon = event.target;
  const deleteLi = icon.parentElement.parentElement.parentElement;
  console.log(icon.parentElement.parentElement.parentElement);
  const deleteInput = icon.getElementsByTagName("input")[0];
  const deleteInputVal = deleteInput.value;
  const commentId = deleteInputVal;
  deleteLi.remove();

  // const commentId = window.location.href.split("/comment")[1];
  const response = await axios({
    url: `/api/${commentId}/comment`,
    method: "delete"
  });

  if (response.status === 200) {
  }
};

const init = () => {
  addCommentForm.addEventListener("submit", handleSubmit);
  // deleteBtn.addEventListener("click", handleDelete);

  Array.from(deleteSubmitBtn).forEach(el => {
    el.addEventListener("click", handleDelete);
  });
};

if (addCommentForm) {
  init();
}
