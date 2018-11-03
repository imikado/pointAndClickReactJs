class ListInventory extends React.Component {

    isSelected(withId_) {
        if (withId_ == this.props.withSelected) {
            return 'selected';
        }
        return '';
    }

    getClass(isEnabled_) {
        if (isEnabled_) {
            return "inventory";
        } else {
            return "inventory disabled"
        }
    }

    getOnclick(isEnabled_, oWith_) {
        if (isEnabled_) {
            return function() {

                EventBus.publish('Game.selectWith', oWith_.id)
            }
        } else {
            return null;
        }
    }

    render() {
        return (<div className={this.getClass(this.props.enabled)}>

            {this.props.tList.map((oWith, index) => <a href="#" onClick={this.getOnclick(this.props.enabled, oWith)} className={this.isSelected(oWith.id)} key={index}><img src={oWith.src}/></a>)}

        </div>);
    }
}
