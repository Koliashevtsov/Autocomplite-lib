interface Result {
    url: string,
    title: string,
    rank: number
}

class DataApi {
  url: string;
  metaData: any;

  constructor(){
    this.url = "https://google-search5.p.rapidapi.com/search-results/?limit=50&ua=desktop&gl=us&hl=en-US&q=";
    this.metaData = {
	    "method": "GET",
	    "headers": {
		  "x-rapidapi-host": "google-search5.p.rapidapi.com",
		  "x-rapidapi-key": "34a8793423msh64cd50af002efdap10ae6ajsnbfa8f08db801"
	    }
    }
  }

  async getDataFromApi(term: string): Promise<Array<Result> | string>{
    try {

      const res = await fetch(this.url + term, this.metaData);
      const data = await res.json();
      return data.results.organic_results;

    } catch (error) {
      if(error) return error.message
    }
  }
}

class Container {
  results: Result[];
  container: HTMLDivElement;
  loading: boolean;

  constructor(){
    this.results = [];
    this.container = this.container = document.createElement('div');
    this.loading = false;
  }

  async request(text: string){
    const dataApi = new DataApi();
    const data = await dataApi.getDataFromApi(text);
    if(typeof(data) == 'object'){
      this.results = data;
      this.loading = false;
      return 'list data'
    }
  }
  addContainerToDOM(e: Event){
    const parentNode = (<HTMLInputElement>e.target).parentNode;
    (<HTMLDivElement>parentNode).style.position = 'relative';
    parentNode.appendChild(this.container);
    this.container.style.position = 'absolute';
    this.container.style.top = '100%';
    this.container.className = "container"
  }

  addItemsToContainer(e: Event){
    this.results.forEach(i => {
      const el = document.createElement('div');
      el.innerHTML = i.title;
      this.container.appendChild(el)
    });
  }
  addSpiner(){
    const el = document.createElement('div');
    el.innerHTML = 'loading';
  }
  clearContainer(){
    this.container.querySelectorAll('*').forEach(n => n.remove());
    this.loading = true;
  }

  async render(e: Event, text: string){
    let resData: string;
    this.addContainerToDOM(e);
    this.clearContainer();
    resData = await this.request(text);
    if(resData == 'list data'){
      this.addItemsToContainer(e)
    }
  }
}

class ElementsSubscribe extends Container {
  elements: HTMLElement[];
  constructor(...elements: HTMLElement[]){
    super()
    this.elements = elements;
  }
  eventCallback(e: Event): void{
    const inputText: string = (<HTMLInputElement>e.target).value;
    super.render(e, inputText)
  }
  listen(event: string){
    this.elements.forEach(i => i.addEventListener(event, this.eventCallback.bind(this)))
  }
}


/////////////////////////////
let firstInput: HTMLElement = document.getElementById('text-input');
const elementsSubscribe = new ElementsSubscribe(firstInput);
elementsSubscribe.listen('input');
