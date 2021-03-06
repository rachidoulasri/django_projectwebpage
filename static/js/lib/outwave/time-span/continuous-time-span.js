
/*
Copyright (c) 2014, Viktor Dorotovic
All rights reserved.
See LICENSE.txt for licensing information.
*/


    /**
     * @module TimeSpan
     */

    /**
     * Continuous time span
     *
     * @class ContinousTimeSpan
     * @extends {TimeSpan}
     * @constructor
     * @param {TimeSpanCollection} collection collection object
     * @param {DataFile} dataFile Waveform data
     * @param {jQuery element} backgroundContainer Container element behind waveform
     * @param {jQuery element} foregroundContainer Container element above waveform
     * @param {Style} style Style object
     */
    var ContinuousTimeSpan = function(collection, dataFile, backgroundContainer, foregroundContainer, style){
        var span = new TimeSpan(collection, dataFile, backgroundContainer, foregroundContainer, style);

        var getStartLimits = span.getStartLimits;

        /**
         * Get range of times this span can start at
         *
         * Extends method from parent class
         *
         * @method  getStartLimits
         * @return {interval} Start limits
         */        
        span.getStartLimits = function(){
            var limits = getStartLimits.call(this);
            
            if(this.getPrev()){
                limits = this.intersectIntervals(limits,{s:this.getPrev().getStart()+this.getPrev().getMinLength(),e:this.getEnd()});
            }else{
                if(this.getStart() !== null){
                    limits.s = limits.e = this.getStart(); // don't allow moving first span
                }
            }


            return limits;
        };


        var getEndLimits = span.getEndLimits;

        /**
         * Get range of times this span can end at
         *
         * Extends method from parent class
         *
         * @method  getEndLimits
         * @return {interval} End limits
         */          
        span.getEndLimits = function(){
            var limits = getEndLimits.call(this);
            
            if(this.getNext()){
                limits = this.intersectIntervals(limits,{s:this.getStart(),e:this.getNext().getEnd()-this.getNext().getMinLength()});
            }else{
                if(this.getEnd() !== null){
                    limits.s = limits.e = this.getEnd(); // don't allow moving last span
                }
            }


            return limits;
        };   

        var setStart = span.setStart;

        /**
         * Sets start time of span
         * 
         * Extends method from parent class
         *
         * @method setStart
         * @param {Number} start Time in seconds
         */
        span.setStart = function(time){
            var prevTime = this.getStart();

            setStart.call(this,time);

            if(time !=prevTime && this.getPrev()) this.getPrev().setEnd(time);
            
        };

        var setEnd = span.setEnd;

        /**
         * Sets end time of span
         * 
         * Extends method from parent class
         *
         * @method  setEnd
         * @param {Number} end Time in seconds
         */        
        span.setEnd = function(time){
            prevTime = this.getEnd();
            setEnd.call(this,time);

            if(time != prevTime && this.getNext()) this.getNext().setStart(time);       

        };


        var setPrev = span.setPrev;

        /**
         * Sets previous span in linked list
         *
         * This function should not be used directly, use collection methods instead
         * 
         * Extends method from parent class
         *
         * @method  setPrev
         * @param {TimeSpan} prev Previous span
         */
        span.setPrev = function(prev){
            setPrev.call(this,prev);
            this.getStartElement().addClass('continuous');
            if(prev){
                this.getStartElement().removeClass('first');
            }else{
                this.getStartElement().addClass('first');
            }
        };

        var setNext = span.setNext;

        /**
         * Sets next span in linked list
         *
         * This function should not be used directly, use collection methods instead
         * 
         * Extends method from parent class
         *
         * @method  setNext
         * @param {TimeSpan} next Next span
         */ 
        span.setNext = function(next){
            setNext.call(this,next);
            this.getEndElement().addClass('continuous');
            if(next){
                this.getEndElement().removeClass('last');
            }else{
                this.getEndElement().addClass('last');
            }
        };


        return span; //return extended object
    };
    