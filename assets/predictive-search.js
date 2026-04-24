class PredictiveSearch extends HTMLElement {
  constructor() {
    super();

    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector('.predictive-search-box');

    if (!this.input || !this.predictiveSearchResults) return;

    this.input.addEventListener('input', this.debounce((event) => {
      this.onChange(event);
    }, 300).bind(this));

    this.input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.close();
      }
    });

    document.addEventListener('click', (event) => {
      const path = event.composedPath ? event.composedPath() : event.path || [];
      if (!path.includes(this)) {
        this.close();
      }
    });
  }

  onChange() {
    const searchTerm = this.input.value.trim();

    if (!searchTerm.length) {
      this.close();
      return;
    }

    this.getSearchResults(searchTerm);
  }

  getSearchResults(searchTerm) {
    fetch(`/search/suggest?q=${encodeURIComponent(searchTerm)}&section_id=predictive-search`)
      .then((response) => {
        if (!response.ok) {
          const error = new Error(response.status);
          this.close();
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const parser = new DOMParser();
        const html = parser.parseFromString(text, 'text/html');
        const section = html.querySelector('#shopify-section-predictive-search');
        if (!section) {
          this.close();
          return;
        }

        this.predictiveSearchResults.innerHTML = section.innerHTML;
        this.open();
      })
      .catch(() => {
        this.close();
      });
  }

  open() {
    this.predictiveSearchResults.style.display = 'block';
    this.input.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.predictiveSearchResults.style.display = 'none';
    if (this.input) {
      this.input.setAttribute('aria-expanded', 'false');
    }
  }

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
}

customElements.define('predictive-search', PredictiveSearch);