module DeallocateManager {

    var _gl;


    export function init(): void{

        _gl = RendererManager.renderer.context;

    }






    var deleteBuffers = function (geometry) {

        if (geometry.__webglVertexBuffer !== undefined) _gl.deleteBuffer(geometry.__webglVertexBuffer);
        if (geometry.__webglNormalBuffer !== undefined) _gl.deleteBuffer(geometry.__webglNormalBuffer);
        if (geometry.__webglTangentBuffer !== undefined) _gl.deleteBuffer(geometry.__webglTangentBuffer);
        if (geometry.__webglColorBuffer !== undefined) _gl.deleteBuffer(geometry.__webglColorBuffer);
        if (geometry.__webglUVBuffer !== undefined) _gl.deleteBuffer(geometry.__webglUVBuffer);
        if (geometry.__webglUV2Buffer !== undefined) _gl.deleteBuffer(geometry.__webglUV2Buffer);

        if (geometry.__webglSkinIndicesBuffer !== undefined) _gl.deleteBuffer(geometry.__webglSkinIndicesBuffer);
        if (geometry.__webglSkinWeightsBuffer !== undefined) _gl.deleteBuffer(geometry.__webglSkinWeightsBuffer);

        if (geometry.__webglFaceBuffer !== undefined) _gl.deleteBuffer(geometry.__webglFaceBuffer);
        if (geometry.__webglLineBuffer !== undefined) _gl.deleteBuffer(geometry.__webglLineBuffer);

        if (geometry.__webglLineDistanceBuffer !== undefined) _gl.deleteBuffer(geometry.__webglLineDistanceBuffer);
        // custom attributes

        if (geometry.__webglCustomAttributesList !== undefined) {

            for (var id in geometry.__webglCustomAttributesList) {

                _gl.deleteBuffer(geometry.__webglCustomAttributesList[id].buffer);

            }

        }

        
        RendererManager.renderer.info.memory.geometries--;

    };



    export var deallocateGeometry = function (geometry) {

        geometry.__webglInit = undefined;

        if (geometry instanceof THREE.BufferGeometry) {

            var attributes = geometry.attributes;

            for (var key in attributes) {

                if (attributes[key].buffer !== undefined) {

                    _gl.deleteBuffer(attributes[key].buffer);

                }

            }

            RendererManager.renderer.info.memory.geometries--;

        } else {

            if (geometry.geometryGroups !== undefined) {

                for (var i = 0, l = geometry.geometryGroupsList.length; i < l; i++) {

                    var geometryGroup = geometry.geometryGroupsList[i];

                    if (geometryGroup.numMorphTargets !== undefined) {

                        for (var m = 0, ml = geometryGroup.numMorphTargets; m < ml; m++) {

                            _gl.deleteBuffer(geometryGroup.__webglMorphTargetsBuffers[m]);

                        }

                    }

                    if (geometryGroup.numMorphNormals !== undefined) {

                        for (var m = 0, ml = geometryGroup.numMorphNormals; m < ml; m++) {

                            _gl.deleteBuffer(geometryGroup.__webglMorphNormalsBuffers[m]);

                        }

                    }

                    deleteBuffers(geometryGroup);

                }

            } else {

                deleteBuffers(geometry);

            }

        }

    };


    export var deallocateTexture = function (texture) {

        if (texture.image && texture.image.__webglTextureCube) {

            // cube texture

            _gl.deleteTexture(texture.image.__webglTextureCube);

        } else {

            // 2D texture

            if (!texture.__webglInit) return;

            texture.__webglInit = false;
            _gl.deleteTexture(texture.__webglTexture);

        }

    };


}