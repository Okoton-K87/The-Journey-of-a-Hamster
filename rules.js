class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Start");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

// class Location extends Scene {
//     create(key) {
//         let locationData = this.engine.storyData.Locations[key]; // TODO: use key to get the data object for the current story location
//         this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        
//         if(locationData.Choices != null) { // TODO: check if the location has any Choices
//             for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
//                 this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
//                 // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
//             }
//         } else {
//             this.engine.addChoice("The end.");
//         }
//     }

//     handleChoice(choice) {
//         if(choice) {
//             this.engine.show("&gt; "+choice.Text);
//             this.engine.gotoScene(Location, choice.Target);
//         } else {
//             this.engine.gotoScene(End);
//         }
//     }
// }

let Nokey = true;
let lightOnTwice = 0;

class Location extends Scene {
    create(key) {

        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);

        if(locationData.Choices) {
            for(let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }

            let itemChoice = locationData.itemChoice;
            let exitChoice = locationData.exitChoice;
            switch(key) {
                case "Lab1":
                case "Bedroom":
                case "Living Room":
                    this.engine.addChoice(itemChoice.Text, itemChoice);
                    break;
                case "Lab2":
                    if(Nokey) {
                        this.engine.addChoice(itemChoice.Text, itemChoice);
                    } else {this.engine.addChoice(exitChoice.Text, exitChoice)}
                    break;
                case "Hidden":
                    if(Nokey) {this.engine.addChoice(itemChoice.Text, itemChoice)}
                    break;
                default:
                    break;
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            let EndingTrigger = false;
            switch(choice.Target) {
                case "Key":
                    Nokey = false;
                case "Phone":
                case "Light On":
                case "Door":
                case "Ending":
                    EndingTrigger = true;
                default:
                    break;
            }
            if(EndingTrigger) {
                this.engine.show("&gt; "+choice.Text);
                this.engine.gotoScene(Item, choice.Target);
            } else {
                this.engine.show("&gt; "+choice.Text);
                this.engine.gotoScene(Location, choice.Target);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class Item extends Scene {
    create(key) {
        let itemData = this.engine.storyData.Items[key];
        this.engine.show(itemData.Body);

        if(itemData.Choices) {
            for(let choice of itemData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            switch(choice.Target) {
                case "Light Off":
                    lightOnTwice += 1;
                    // this.engine.show("Light +1");
                    if (lightOnTwice < 2) {
                        this.engine.show("&gt; "+choice.Text);
                        this.engine.gotoScene(Item, choice.Target);
                    } else {
                        // this.engine.show("&gt; "+choice.Text);
                        this.engine.gotoScene(Item, "Light End");
                    }    
                    break;
                default:
                    this.engine.show("&gt; "+choice.Text);
                    this.engine.gotoScene(Location, choice.Target);
                    break;
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}



class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');v