
const tagsSection = document.getElementsByClassName('tags-section')[0];

const showTagFormButton = document.getElementById('show-tag-form-button');
const submitTagButton = document.getElementById('submit-tag-button');
const addTagForm = document.getElementById('add-tag-form');

const screedId = tagsSection.id;
console.log('screedId:', screedId);

showTagFormButton.addEventListener('click', async (event) => {
    event.preventDefault();
    console.log("CLICKIN ON THE SHOW TAG FORM BUTTON");
});


submitTagButton.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log("CLICKIN ON THE SUBMIT TAG BUTTON");
    const formData = new FormData(addTagForm);
    const entries = formData.entries();
    console.log('entries: ', entries);
    const data = {};
    for (let entry of entries) {
        data[entry[0]] = entry[1];
    }
    console.log('data:', data);

    const body = {
        tag: data.tag
    };

    await fetch(`http://localhost:8081/screeds/${screedId}/tags`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
        }
    });
});
