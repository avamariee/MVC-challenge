async function editPost(event) {
    event.preventDefault();
  
    const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    const title = document.querySelector('input[name="post-title"]').value.trim();
    const body = document.querySelector('input[name="post-body"]').value.trim();
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        body
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      document.location.replace('/dashboard/');
    } else {
      alert('There was an error!' + response.statusText);
    }
  }
  
  document.querySelector('.edit-post-form').addEventListener('submit', editPost);
  