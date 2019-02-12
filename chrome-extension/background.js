try {
    repo = document.getElementsByClassName("ssh-clone-options")[0].getElementsByClassName("form-control")[0].value;
    uri = encodeURI(repo);
    text = `<div class="BtnGroup">
    <a href="localhost:8735?repo=${uri}" class="btn btn-sm empty-icon float-right BtnGroup-item btn-primary">
        Dever
    </a>
</div>`;

    var div = document.createElement('div');
    div.innerHTML = text.trim();
    document.getElementsByClassName("file-navigation")[0].appendChild(div.firstChild);
    console.log(text);
} catch (e) {
    console.log(e)
}
