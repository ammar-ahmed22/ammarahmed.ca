import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Animated from './Animated';
import '../assets/css/hero.css'


//import canvasHover from '../assets/images/canvashover.png';

import Typist from 'react-typist';

import RobotModel from './RobotModel';
import DarkModeToggle from './DarkModeToggle';

class Hero extends Component {

    state = {
        canvasRedirect: false,
        canvasId: 0,
        toggleAnimation: false
    }

    mediaQuery = window.matchMedia(" (max-width: 600px) ");
    componentDidMount(){
        if (!this.mediaQuery.matches){
            document.querySelector("canvas").addEventListener("click", this.handleCanvasClick)
        }

        setTimeout(()=>{
            this.setState({toggleAnimation: true})
        }, 1000)
       
    }

    handleCanvasClick = (e) =>{
        this.setState({canvasRedirect: true})
    }

    handleToggleClick = (e) =>{
        
        this.props.toggleIsDark();
    }

    updateCanvasId = () =>{
        this.setState( prevState =>{
            return {canvasId: prevState.canvasId + 1}
        })
    }

    render() {
        if (this.state.canvasRedirect){
            return <Redirect push to="/snake"/>;
        }
        

        
        return (
            <section className="hero d-flex align-items-center" id="home">
                <div className="container">
                <div className="row">
                    <DarkModeToggle isDark={this.props.isDark} toggleIsDark={this.props.toggleIsDark} updateCanvasId={this.updateCanvasId}/>
                    <div className="col-md-6  d-flex flex-column">
                        <Animated from={{opacity: 0, marginTop: 0}} to={{opacity: 1, marginTop: 0}} duration={2000} toggle={this.state.toggleAnimation}>
                            <Typist avgTypingDelay={120} cursor={{show: false}} >
                                <h1 className="display-1 text-light type-text">hi, i'm <span className="text-purple">ammar</span></h1>
                            </Typist>    
                        </Animated>
                        <Animated from={{opacity: 0, marginTop: 200}} to={{opacity: 1, marginTop: 0}} duration={2000}  toggle={this.state.toggleAnimation}>
                            <h2 className="text-light">Nanotechnology Engineer with a passion to learn</h2>
                        </Animated>
                        
                        {/* <h2 className="text-light">Nanotechnology Engineer with a passion to learn</h2> */}
                        <Animated from={{opacity: 0, marginTop: 0}} to={{opacity: 1, marginTop: 0}} duration={2000}  toggle={this.state.toggleAnimation}>
                            <p className="text-slate fs-5">I’m a second year engineering student at the University of Waterloo with a strong interest in software development</p>
                        </Animated>
                        
                        
                        <a href="#about" className="scroll-ind text-purple text-decoration-none display-5 cursor-pointer"><i className='bx bxs-down-arrow-alt'></i></a>
                        
                    </div>
                </div>
                
                </div>
                

                {!this.mediaQuery.matches && (
                <Animated animProps={{to: {opacity: 1}, from: {opacity: 0}, config: {duration: 2000}}}>
                    <RobotModel isDark={this.props.isDark} id={this.state.canvasId} />
                </Animated>
                
                )}
       
      </section>
        );
    }
}

export default Hero;
