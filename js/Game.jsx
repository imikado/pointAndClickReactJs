class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            tVerbs: [],
            roomToStart: '',
            tRoom: [],
            tImage: [],
            tVerbs: [],
            verbSelected: '',
            itemSelected: '',
            inventorySelected: ''
        };
        //this.handleChange = this.handleChange.bind(this);

        //this.loadData();

        console.log('load Game');

        this.loadData();

        EventBus.subscribe('Game.selectItem', this.selectItem.bind(this));

        EventBus.subscribe('Game.selectVerb', this.selectVerb.bind(this));

    }

    selectVerb(verb_) {
        this.setState({verbSelected: verb_});

        console.log('selectVerb ' + verb_);
    }

    selectItem(id_) {

        console.log('select Item ' + id_);
    }

    loadData() {
        console.log('loadData');

        var requestURL = './data/main.json';

        var oRequest = new XMLHttpRequest();
        oRequest.open('GET', requestURL, true);
        oRequest.responseType = 'json';
        oRequest.send();

        oRequest.oGame = this;

        oRequest.onload = function() {
            console.log('loaded');
            var oData = oRequest.response;

            this.oGame.processData(oData);
        }
    }

    processData(oData) {
        console.log('processData Game');
        console.log(oData);

        this.processListVerbs(oData.listVerbs);

        this.state.tVerbs = oData.listVerbs;
        this.state.roomToStart = oData.roomToStart;

        this.loadRoom(this.state.roomToStart);
    }

    processListVerbs(listVerbs) {
        this.setState({tVerbs: listVerbs});
    }

    loadRoom(room) {
        if (!this.state.tRoom[room]) {
            this.readRoom(room);
            return;
        }

        var oRoom = this.state.tRoom[room];

        console.log('set room background:' + oRoom.background);
        this.setState({background: oRoom.background, tImage: oRoom.tImage});

        /*
        //image
        if (oRoom.tImage) {
            console.log(oRoom.tImage);
            for (var i in oRoom.tImage) {

                console.log('boucle image');

                var oImage = oRoom.tImage[i];

                this.processListEvent(oImage.listOn, oImage.id, room);

                oSvg.addImage({
                    "id": oImage.id,
                    "class": "clickable",
                    "x": oImage.x,
                    "y": oImage.y,
                    "opacity": 1,
                    "src": oImage.src
                });

            }
        }
		*/
    }

    readRoom(room) {
        var requestURL = './data/' + room + '.json';

        console.log("readRoom " + requestURL);

        var oRequest = new XMLHttpRequest();
        oRequest.open('GET', requestURL, true);
        oRequest.responseType = 'json';

        oRequest.oGame = this;
        oRequest.send();

        oRequest.onload = function() {
            var oData = oRequest.response;

            if (null == oData) {
                alert('Error on load ' + requestURL);
            }

            this.oGame.processRoom(oData);
            this.oGame.loadRoom(oData.id);
        }
    }

    processRoom(oJsonRoom) {

        console.log('processRoom');
        console.log('json:');
        console.log(oJsonRoom);

        var oRoom = {
            id: '',
            background: '',
            tRectArea: [],
            tImage: []
        };
        oRoom.id = oJsonRoom.id
        oRoom.background = oJsonRoom.background;
        for (var j in oJsonRoom.listRectArea) {
            var jsonRectArea = oJsonRoom.listRectArea[j];
            oRoom.tRectArea.push(jsonRectArea);
        }
        for (var k in oJsonRoom.listImage) {
            var jsonImage = oJsonRoom.listImage[k];
            oRoom.tImage.push(jsonImage);

            this.state.tImage[jsonImage.id] = jsonImage;
        }

        this.state.tRoom[oJsonRoom.id] = oRoom;

    }

    start() {
        console.log('start Game');
    }

    render() {

        return (<div>
            <div id="Game" style={{

                    background: 'url(' + this.state.background + ') bottom no-repeat'
                }}>
                <svg width="600" height="400">
                    <SvgImages tList={this.state.tImage}/>

                </svg>

            </div>
            <ListVerbs verbSelected={this.state.verbSelected} tList={this.state.tVerbs}/></div>);

    }
}
