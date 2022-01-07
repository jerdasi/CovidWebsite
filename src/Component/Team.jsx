class ComponentCard extends React.Component {
  render() {
    return(
      <div className="col-md-3 col-sm-6 col-xs-12">
        <div className="single-team">
            <div className="img-area">
                <img src={this.props.gambar} className="img-responsive"/>
            </div>
            <div className="img-text">
                <h4>{this.props.nama}</h4>
                <h4 className="tipis">{this.props.job}</h4>
                <h5 className="tipis">{this.props.nim}</h5>
            </div>
        </div>
      </div>
    )
  }
}

class Team extends React.Component {
  render(){
    return(
      <div className="row justify-content-md-center" id="team">
        <ComponentCard gambar="../img/181112931.jpg" nama="Jeremia Daniel Silitonga" job="Web Developer" nim="<181112931/>"/>
        <ComponentCard gambar="../img/181113243.jpg" nama="Welly Josua Rajagukguk" job="-" nim="<181113243/>"/>
        <ComponentCard gambar="../img/181113031.jpg" nama="Gilbert Fernando Situmorang" job="Android Developer" nim="<181113031/>"/>
      </div>
      
    )
  }
}

ReactDOM.render(<Team/>, document.getElementById("footer"))