/**
 * @Class : libs
 * realiza rotacao e translacao de objetos
 */
var LIBS = {
    /**
     * @method detToRad
     * converte graus para radianos
     * @param {int} angle
     */
    degToRad: function (angle) {
        return(angle * Math.PI / 180);
    },
    /**
     * @method getProjectionz
     * obtem a projecao do objeto em z
     * @param {int} angle
     * @param {int} a
     * @param {int} zMin
     * @param {int} zMax
     */
    get_projection: function (angle, a, zMin, zMax) {
        var tan = Math.tan(LIBS.degToRad(0.5 * angle));
        var A = -(zMax + zMin) / (zMax - zMin);
        var B = (-2 * zMax * zMin) / (zMax - zMin);

        return [
            0.5/tan, 0,   0,  0,
            0, 0.5*a/tan, 0,  0,
            0, 0,         A, -1,
            0, 0,         B,  0
        ];
    },
    /**
     * @method getMatrix4x
     * obtem uma matrix 4x4
     */
    get_I4: function () {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },
    /**
     * @method setMatrix4x
     * obtem uma matrix 4x4 normal
     * @param {array} m
     */
    set_I4: function (m) {
        m[0]  = 1, m[1]  = 0, m[2]  = 0, m[3]  = 0,
        m[4]  = 0, m[5]  = 1, m[6]  = 0, m[7]  = 0,
        m[8]  = 0, m[9]  = 0, m[10] = 1, m[11] = 0,
        m[12] = 0, m[13] = 0, m[14] = 0, m[15] = 1;
    },
    /**
     * @method rotatex
     * rotaciona matriz em x
     * @param {array} m
     * @param {int} angle
     */
    rotateX: function (m, angle) {
        
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);
        
        var mv1 = m[1], mv5 = m[5], mv9 = m[9];
        
        m[1] = m[1] * cosAngle - m[2] * sinAngle;
        m[5] = m[5] * cosAngle - m[6] * sinAngle;
        m[9] = m[9] * cosAngle - m[10]* sinAngle;

        m[2] = m[2] * cosAngle + mv1 * sinAngle;
        m[6] = m[6] * cosAngle + mv5 * sinAngle;
        m[10]= m[10]* cosAngle + mv9 * sinAngle;
        
    },
    /**
     * @method rotatey
     * rotaciona matriz em y
     * @param {array} m
     * @param {int} angle
     */
    rotateY: function (m, angle) {
        
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);
        
        var mv0 = m[0], mv4 = m[4], mv8 = m[8];
        
        m[0] = cosAngle * m[0] + sinAngle * m[2];
        m[4] = cosAngle * m[4] + sinAngle * m[6];
        m[8] = cosAngle * m[8] + sinAngle * m[10];

        m[2] = cosAngle * m[2] - sinAngle * mv0;
        m[6] = cosAngle * m[6] - sinAngle * mv4;
        m[10]= cosAngle * m[10]- sinAngle * mv8;
        
    },
    /**
     * @method rotatez
     * rotaciona matriz em z
     * @param {array} m
     * @param {int} angle
     */
    rotateZ: function (m, angle) {
        
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);
        
        var mv0 = m[0], mv4 = m[4], mv8 = m[8];
        
        m[0] = cosAngle * m[0] - sinAngle * m[1];
        m[4] = cosAngle * m[4] - sinAngle * m[5];
        m[8] = cosAngle * m[8] - sinAngle * m[9];

        m[1] = cosAngle * m[1] + sinAngle * mv0;
        m[5] = cosAngle * m[5] + sinAngle * mv4;
        m[9] = cosAngle * m[9] + sinAngle * mv8;
        
    },
    /**
     * @method translatez
     * translada matriz em z
     * @param {array} m
     * @param {int} t valor de translacao
     */
    translateZ: function (m, t) {
        m[14] += t;
    }
};