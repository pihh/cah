// Setup code
class Reactive {
  constructor(obj) {
    this.contents = obj;
    this.listeners = {};
    this.makeReactive(obj);
  }
  makeReactive(obj) {
    Object.keys(obj).forEach((prop) => this.makePropReactive(obj, prop));
  }

  makePropReactive(obj, key) {
    let value = obj[key];

    // Gotta be careful with this here
    const that = this;

    Object.defineProperty(obj, key, {
      get() {
        return value;
      },
      set(newValue) {
        value = newValue;
        that.notify(key);
      },
    });
  }

  listen(prop, handler) {
    if (!this.listeners[prop]) this.listeners[prop] = [];

    this.listeners[prop].push(handler);
  }

  notify(prop) {
    this.listeners[prop].forEach((listener) => listener(this.contents[prop]));
  }
}

/*
const data = new Reactive({
  foo: "bar",
});

data.listen("foo", (change) => console.log("Change: " + change));

data.contents.foo = "baz";
*/


function ReactiveObject(data={}){
	let reactions = new Map()
	let ReactiveObject = new Proxy(data,{
	  set(target,prop,value,reciever){
		let oldValue = target[prop]
	   
		Reflect.set(...arguments) // Set the new value
		if(oldValue !=value){
		  
		  let reactionsForProperty = reactions.get(prop);
		  if(reactionsForProperty){
			reactionsForProperty.forEach(reaction => reaction(value)) // Run'em all
		  }
		  return true
		}
	  }
	})
	ReactiveObject.$watch = function(prop,reaction){
	  let reactionsForProperty = reactions.get(prop);

	  if(!reactionsForProperty){
		reactionsForProperty = new Set()
		reactions.set(prop,reactionsForProperty)
	  }
	  reactionsForProperty.add(reaction)
	}
	return ReactiveObject
}

