class Game extends React.Component {

    constructor(props) {
        super(props);

        this.verbSelected = '';
        this.withSelected = '';
        this.itemSelected = '';

        this.roomSelected = '';

        this.tInventory = Array();

        this.state = {
            roomToStart: '',
            tVerbs: [],
            tImage: [],
            tVerbs: [],
            tInventory: this.tInventory,
            verbSelected: this.verbSelected,
            message: '',
            messageDisplay: 'none',
            messageBorderColor: 'white',

            withEnabled: false
        };

        this.tRoom = Array(),
        this.tImage = Array(),
        this.tEvent = Array();

        this.loadData();

        EventBus.subscribe('Game.selectItem', this.selectItem.bind(this));
        EventBus.subscribe('Game.selectVerb', this.selectVerb.bind(this));
        EventBus.subscribe('Game.selectWith', this.selectWith.bind(this));
        EventBus.subscribe('Game.closeModal', this.closeModal.bind(this));
        EventBus.subscribe('Game.closeConversation', this.closeConversation.bind(this));

        EventBus.subscribe('Game.loadRoom', this.loadRoom.bind(this));

    }

    closeModal() {
        this.setState({messageDisplay: 'none'});
    }

    closeConversation() {
        this.setState({conversationDisplay: 'none'});
    }

    resetSelection() {
        //this.verbSelected = '';
        //this.withSelected = '';
        this.itemSelected = '';

        this.selectVerb('');
        this.selectWith('');
    }

    selectVerb(verb_) {
        this.verbSelected = verb_;

        this.setState({verbSelected: verb_});

        if (verb_ == 'utiliser') {
            this.setState({withEnabled: true});
        } else {
            this.setState({withEnabled: false});
        }
    }

    selectWith(with_) {
        this.withSelected = with_;

        this.setState({withSelected: with_});
    }

    selectItem(item_) {

        this.itemSelected = item_;

        if (this.verbSelected == '') {
            this.messageError('Veuillez selectionner un verbe');
        } else if (false == this.canExecuteAction(this.verbSelected, this.withSelected, this.itemSelected)) {
            this.messageError('Je ne pense pas :( ');
        }

        this.resetSelection();
    }

    addInventory(oItem_) {

        if (0 > this.tInventory.indexOf(oItem_)) {
            this.tInventory.push(oItem_);

            this.deleteImage(oItem_.id);

        }
    }

    deleteFromInventory(inventory_) {
        for (var i in this.tInventory) {
            var oInventory = this.tInventory[i];

            if (oInventory.id == inventory_) {
                this.tInventory.splice(i - 1, 1);
            }
        }
    }

    deleteImage(imageId_) {

        var oRoom = this.tRoom[this.roomSelected];

        var tImage = oRoom.tImage;
        //var newTimage = Array();
        for (var i in tImage) {
            if (tImage[i].id != imageId_) {

                tImage.splice(i - 1, 1);

            }
        }
    }

    reloadRoom() {
        this.loadRoom(this.roomSelected);
    }

    processListEvent(listOn_, id_, room_) {
        if (listOn_) {
            for (var i in listOn_) {

                var oOn = listOn_[i];
                oOn.action.id = id_;
                oOn.action.fromRoom = room_;

                if (oOn.with) {
                    this.addEvent([
                        oOn.verb, oOn.with, id_
                    ], oOn.action);

                } else {
                    this.addEvent([
                        oOn.verb, id_
                    ], oOn.action);

                }

            }
        }
    }

    addEvent(tKey_, oAction_) {

        if (!this.tEvent[tKey_.join('__')]) {
            this.tEvent[tKey_.join('__')] = Array();
        }

        this.tEvent[tKey_.join('__')].push(oAction_);
    }

    canExecuteAction(verbSelected_, withSelected_, itemSelected_) {

        var tKey = Array();
        if (withSelected_ != '') {
            tKey = [verbSelected_, withSelected_, itemSelected_];
        } else {
            tKey = [verbSelected_, itemSelected_];
        }
        var sKey = tKey.join('__');

        if (this.tEvent[sKey]) {
            this.executeAction(this.tEvent[sKey]);

            if (withSelected_ != '') {
                this.deleteFromInventory(withSelected_);
            }

            return true;
        }

        return false;
    }

    executeAction(tAction_) {

        Debug.log('executeAction');
        Debug.log(tAction_);

        if (tAction_) {
            for (var i in tAction_) {

                var oAction = tAction_[i];

                if (oAction.funct == 'addInventory') {
                    this.addInventory(this.tImage[oAction.id]);

                } else if (oAction.funct == 'loadRoom') {

                    Debug.log('executeAction: loadRoom' + oAction.room);

                    this.loadRoom(oAction.room);

                } else if (oAction.funct == 'message') {
                    this.message(oAction.message);
                } else if (oAction.funct == 'setState') {
                    this.switchState(oAction.fromRoom, oAction.id, oAction.state);
                } else if (oAction.funct == 'conversation') {
                    this.conversation(oAction.listConversation);
                }
            }
        }

    }

    switchState(room_, id_, state_) {
        var oRoom = this.tRoom[room_];

        for (var i in oRoom.tImage) {
            var oImage = oRoom.tImage[i];
            if (oImage.id == id_) {
                Debug.log('trouvee ' + oImage.id);

                var oState = oImage.listState[state_];

                Debug.log(oState);

                for (var key in oState) {
                    oImage[key] = oState[key];
                }

            }
        }
    }

    message(message_) {
        Debug.log(message_);

        this.setState({message: message_, messageDisplay: 'block', messageBorderColor: 'darkgreen'});
    }

    messageError(message_) {
        Debug.log(message_);

        this.setState({message: message_, messageDisplay: 'block', messageBorderColor: 'darkred'});
    }

    conversation(listConversation_) {
        this.setState({conversationList: listConversation_, conversationDisplay: 'block'});
    }

    loadData() {
        Debug.log('loadData');

        var requestURL = './data/main.json';

        var oRequest = new XMLHttpRequest();
        oRequest.open('GET', requestURL, true);
        oRequest.responseType = 'json';
        oRequest.send();

        oRequest.oGame = this;

        oRequest.onload = function() {
            Debug.log('loaded');
            var oData = oRequest.response;

            this.oGame.processData(oData);
        }
    }

    processData(oData) {
        Debug.log('processData Game');

        this.processListVerbs(oData.listVerbs);

        this.state.tVerbs = oData.listVerbs;
        this.state.roomToStart = oData.roomToStart;

        this.loadRoom(this.state.roomToStart);
    }

    processListVerbs(listVerbs) {
        this.setState({tVerbs: listVerbs});
    }

    loadRoom(room) {
        if (!this.tRoom[room]) {
            this.readRoom(room);
            return;
        }

        this.tEvent = Array();

        this.roomSelected = room;

        var oRoom = this.tRoom[room];

        Debug.log('set room background:' + oRoom.background);
        this.setState({background: oRoom.background, tImage: oRoom.tImage});

        //image
        if (oRoom.tImage) {
            for (var i in oRoom.tImage) {

                var oImage = oRoom.tImage[i];

                this.processListEvent(oImage.listOn, oImage.id, room);

            }
        }

    }

    readRoom(room) {
        var requestURL = './data/' + room + '.json';

        Debug.log("readRoom " + requestURL);

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

        Debug.log('processRoom');

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

            this.tImage[jsonImage.id] = jsonImage;
        }

        this.tRoom[oJsonRoom.id] = oRoom;

    }

    start() {
        Debug.log('start Game');
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
            <ListVerbs verbSelected={this.state.verbSelected} tList={this.state.tVerbs}/>
            <ListInventory enabled={this.state.withEnabled} withSelected={this.state.withSelected} tList={this.state.tInventory}/>
            <Modal message={this.state.message} messageDisplay={this.state.messageDisplay} messageBorderColor={this.state.messageBorderColor}/>

            <Conversation tMessage={this.state.conversationList} conversationDisplay={this.state.conversationDisplay}/>
        </div>);

    }
}
