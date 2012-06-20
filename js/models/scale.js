define(["jquery",
        "order!access",
        "order!collections/scalevalues",
        "order!underscore",
        "order!backbone"],
       
    function($, ACCESS, ScaleValues){
    
        /**
         * scale model
         * @class
         */
        var Scale = Backbone.Model.extend({
            
            defaults: {
                access: ACCESS.PRIVATE,
                created_at: null,
                created_by: null,
                updated_at: null,
                updated_by: null,
                deleted_at: null,
                deleted_by: null
            },
            
            initialize: function(attr){
                if(!attr  || _.isUndefined(attr.name) || attr.name == "")
                    throw "'name' attribute is required";
                
                this.set(attr);
                
                if(attr.scaleValues && _.isArray(attr.scaleValues))
                    this.set({scaleValues: new ScaleValues(attr.labels,this)});
                else
                    this.set({scaleValues: new ScaleValues([],this)});
                
                // Check if the track has been initialized 
                if(!attr.id){
                    // If local storage, we set the cid as id
                    if(window.annotationsTool.localStorage)
                        this.set({id:this.cid});
                        
                    this.toCreate = true;
                }
                
                if(!attr.id){
                    this.toCreate = true;
                }
                
                // If localStorage used, we have to save the video at each change on the children
                if(window.annotationsTool.localStorage){
                    this.attributes['scaleValues'].bind('change',function(scalevalue){
                            this.save();
                            this.trigger("change");
                    },this);
                }
            },
            
            parse: function(attr) {
                attr.created_at = attr.created_at != null ? Date.parse(attr.created_at): null;
                attr.updated_at = attr.updated_at != null ? Date.parse(attr.updated_at): null;
                attr.deleted_at = attr.deleted_at != null ? Date.parse(attr.deleted_at): null;
                return attr;
            },
            
            validate: function(attr){
                
                if(attr.id){
                    if(this.get('id') != attr.id){
                        this.id = attr.id;
                        this.setUrl();
                    }
                }
                
                if(attr.name && !_.isString(attr.name))
                    return "'name' attribute must be a string";
                
                if(attr.description && !_.isString(attr.description))
                    return "'description' attribute must be a string";
                
                if(attr.created_by && !(_.isNumber(attr.created_by) || attr.created_by instanceof User))
                    return "'created_by' attribute must be a number or an instance of 'User'";
                
                if(attr.updated_by && !(_.isNumber(attr.updated_by) || attr.updated_by instanceof User))
                    return "'updated_by' attribute must be a number or an instance of 'User'";
                
                if(attr.deleted_by && !(_.isNumber(attr.deleted_by) || attr.deleted_by instanceof User))
                    return "'deleted_by' attribute must be a number or an instance of 'User'";
                
                if(attr.created_at){
                    if((tmpCreated=this.get('created_at')) && tmpCreated!==attr.created_at)
                        return "'created_at' attribute can not be modified after initialization!";
                    if(!_.isNumber(attr.created_at))
                        return "'created_at' attribute must be a number!";
                }
        
                if(attr.updated_at && !_.isNumber(attr.updated_at))
                    return "'updated_at' attribute must be a number!";

                if(attr.deleted_at && !_.isNumber(attr.deleted_at))
                    return "'deleted_at' attribute must be a number!";
            },
            
            /**
             * Modify the current url for the annotations collection
             */
            setUrl: function(){
                this.get("scaleValues").setUrl(this);
            }
        });
        
        return Scale;
    
});