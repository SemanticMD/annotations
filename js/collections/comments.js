/**
 *  Copyright 2012, Entwine GmbH, Switzerland
 *  Licensed under the Educational Community License, Version 2.0
 *  (the "License"); you may not use this file except in compliance
 *  with the License. You may obtain a copy of the License at
 *
 *  http://www.osedu.org/licenses/ECL-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an "AS IS"
 *  BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 *  or implied. See the License for the specific language governing
 *  permissions and limitations under the License.
 *
 */

define(["jquery",
        "models/comment",
        "backbone",
        "localstorage"],
    
    function($,Comment,Backbone){
    
        /**
         * Comments collection
         * @class
         */
        var Comment = Backbone.Collection.extend({
            model: Comment,
            localStorage: new Backbone.LocalStorage("Comments"),
            
            /**
             * @constructor
             */
            initialize: function(models,annotation){
                _.bindAll(this,"setUrl");
                
                this.setUrl(annotation);
            },
            
            parse: function(resp, xhr) {
              if(resp.comments && _.isArray(resp.comments))
                return resp.comments;
              else if(_.isArray(resp))
                return resp;
              else
                return null;
            },
            
            /**
             * Define the url from the collection with the given annotation
             *
             * @param {Annotation} annotation containing the comments
             */
            setUrl: function(annotation){
                if(!annotation){
                    throw "The parent annotation of the comments must be given!";
                } else if (annotation.collection) {
                    this.url = annotation.url() + "/comments";  
                }

                if(window.annotationsTool && annotationsTool.localStorage)
                      this.localStorage = new Backbone.LocalStorage(this.url);
            }
        });
        
        return Comment;

});
    
    