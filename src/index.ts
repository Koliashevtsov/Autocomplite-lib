class Container {
  results: string[];
  container: HTMLDivElement;

  constructor(items: string[]){
    this.results = items;
    this.container = this.container = document.createElement('div')
  }

  request(text: string): void{
    this.results.push(text)
  }

  render(e: Event): void {
    this.results.forEach(i => {
      const el = document.createElement('div');
      el.innerHTML = i;
      this.container.appendChild(el)
      this.container.className = "container"
    });
    const parentNode = (<HTMLInputElement>e.target).parentNode;
    parentNode.appendChild(this.container);
    (<HTMLDivElement>parentNode).style.position = 'relative';
    this.container.style.position = 'absolute';
    this.container.style.top = '100%';
  }
}

class ElementsSubscribe extends Container {
  elements: HTMLElement[];
  constructor(...elements: HTMLElement[]){
    super([])
    this.elements = elements;
  }
  eventCallback(e: Event): void{
    const inputText: string = (<HTMLInputElement>e.target).value;
    super.request(inputText);
    super.render(e)
  }
  listen(event: string){
    this.elements.forEach(i => i.addEventListener(event, this.eventCallback.bind(this)))
  }
}


/////////////////////////////
let firstInput: HTMLElement = document.getElementById('text-input');
const elementsSubscribe = new ElementsSubscribe(firstInput);
elementsSubscribe.listen('input');
