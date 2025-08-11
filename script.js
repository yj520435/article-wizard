// @ts-nocheck
const article = document.getElementById('article');
const textarea = document.getElementById('textarea');

const wizard = new ArticleWizard(article);

if (article) {
  // Initialize
  article.focus();
  article.oninput = () => wizard.input();
  article.onkeydown = (event) => {
    if (event.key === 'Enter') {
      wizard.enter(event);
    }
    if (event.key === 'Tab') {
      wizard.tab(event);
    }
  };

  // Observer
  const observer = new MutationObserver(() => {
    if (article.children.length < 1) article.innerHTML = '<p></p>';
  });
  observer.observe(article, { childList: true });
}

tooltip();

function tooltip() {
  const buttons = document.getElementsByClassName('btn');

  for (const button of buttons) {
    const title = button.nextElementSibling;
    if (!title) return;

    if (button instanceof HTMLElement && title instanceof HTMLElement) {
      button.onmouseover = () => (title.style.display = 'block');
      button.onmouseout = () => (title.style.display = 'none');
    }
  }
}

async function fetchExample() {
  const base = document.getElementById('base');

  if (!base || !article || !textarea) return;

  const currentMode = base.classList.value;

  const file = await fetch('library/example.txt');
  const text = await file.text();

  if (currentMode === 'html') {
    article.innerHTML = '';
    wizard.convertMarkdownToHtml(text, article);

    const links = article.getElementsByTagName('a');
    Array.from(links).forEach((link) => {
      link.onclick = (event) => window.open(link.href, '_blank');
    });
  } else {
    textarea.value = text;
  }
}

function switchMode() {
  const base = document.getElementById('base');
  if (!base || !article || !textarea) return;

  const currentMode = base.classList.value;
  const toMarkdown = currentMode === 'html';

  // Html -> Markdown
  if (toMarkdown) {
    base.classList.replace('html', 'markdown');
    textarea.value = wizard.convertHtmlToMarkdown(article);
    textarea.focus();
  }
  // Markdown -> Html
  else {
    base.classList.replace('markdown', 'html');
    article.innerHTML = '';
    wizard.convertMarkdownToHtml(textarea.value, article);
    wizard.focus(article.firstChild);
  }
}
