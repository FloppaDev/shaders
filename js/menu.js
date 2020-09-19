(() => {
  let btnMenu = document.getElementById('buttons');
  let sourceBtn = btnMenu.getElementsByClassName('button')[0];

  Object.keys(Shaders).forEach((shader, _) => {
    let button = sourceBtn.cloneNode(true);
    button.innerText = shader;
    button.onclick = () => {
      history.pushState(
        { id: 'shaders'},
        `Shaders | ${shader}`,
        `?shader=${shader}`
      );

      // window.location.href = `?shader=${shader}`;
    };
    btnMenu.appendChild(button);
  });

  sourceBtn.remove();

  let menu = document.getElementById('menu');

  document.onkeydown = (event) => {
    if(event.keyCode == 72) {
      if(menu.classList.contains('hidden'))
        menu.classList.remove('hidden');
      else
        menu.classList.add('hidden');
    }
  };
})();
