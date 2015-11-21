/**
 * @Class : main
 * realiza desnho de um cubo 3d
 */
var main = function () {
    /**
     * @define canvas poroperts
     */
    var CANVAS = document.getElementById("canvas_cube");
        CANVAS.width  = window.innerWidth;
        CANVAS.height = window.innerHeight;

   /** Capturar eventos do mouse **/

    var AMORTIZATION = 0.95;
    var drag = false;


    var old_x, old_y;
    var dX = 0, dY = 0;
    
    var mouseDown = function (e) {
        drag = true;
        
        old_x = e.pageX;
        old_y = e.pageY;
        
        e.preventDefault();
        return false;
    };

    var mouseUp = function (e) {
        drag = false;
    };

    var mouseMove = function (e) {
        if (!drag) return false;
        
        dX = (e.pageX - old_x) * 2 * Math.PI / CANVAS.width;
        dY = (e.pageY - old_y) * 2 * Math.PI / CANVAS.height;
        
        THETA += dX;
        PHI += dY;
        
        old_x = e.pageX;
        old_y = e.pageY;
        
        e.preventDefault();
    };

    CANVAS.addEventListener("mousedown", mouseDown, false);
    CANVAS.addEventListener("mousemove", mouseMove, false);
    CANVAS.addEventListener("mouseout", mouseUp, false);
    CANVAS.addEventListener("mouseup", mouseUp, false);
    
    //CANVAS.addEventListener("touchstart", mouseDown, false);
    CANVAS.addEventListener("touchmove", mouseMove, false);
    //CANVAS.addEventListener("touchcancel", mouseUp, false);
    CANVAS.addEventListener("touchleave", mouseUp, false);
    CANVAS.addEventListener("touchend", mouseUp, false);

    /** Obtem contexto WebGL **/
    // esta variavel é o ponto de acesso com a lib
    var GL;
    //atribuimos a variavel GL todas as funconalidades da biblioteca webgl
    try {
        /**
         * @method getContext
         * Obtem o contexto de WebGL
         * @param {string} contextType
         *  "2d" => para contexto 2D que representa um contexto de renderização bidimensional
         *  "WebGL" ou "experimental-WebGL" => para objeto que representa um contexto de renderização tridimensional
         *  "Webgl2" ou "experimental-webgl2" =>  para objeto que representa um contexto de renderização tridimensional
         * @param {object} contextAttributes
         *  "antialias" => habilita a suavilização na criacao do contexto WebGL
         */
        GL = CANVAS.getContext("experimental-webgl", {antialias: true});
    } catch (e) {
        alert("Seu navegador nao tem suporte para WebGL.");
        return false;
    }

     /** Shaders **/

    /**
     * @declare : shaders
     * shaders sao pedaços de códigos compilados por WebGL e executados sem dipositivo grafo
     **/

    /**
     * @attribute : shader_vertex_source
     * é executado a cada vertice do cubo, como um sombreador. 
     * calcula a posicao do ponto sobre a tela de visualização
     * gl_Position é dado em coordenadas
     */

    var shader_vertex_source = "\n\
        attribute vec3 position;\n\
        uniform mat4 Pmatrix;\n\
        uniform mat4 Vmatrix; //Vmatrix é a matrix de movimento dos objetos para exibição\n\
        uniform mat4 Mmatrix; //Mmatrix é a matrix de movimento do cubo\n\
        attribute vec3 color; //a cor do ponto dado como um vetor RGB\n\
        varying vec3 vColor;  //usado para dar cor ao fragmento shader\n\
        void main(void) { //funcao pre-construtora\n\
        gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
        vColor=color; //vColor é interpolado entre os pontos do cubo/triangulo\n\
    }";

    /**
     * @attribute : shader_fragment_source (ou pixel)
     * é executado a cada pixel redenrizado. 
     * retona a cor RGBA do pixel com o gl_FragColor
     */
    var shader_fragment_source = "\n\
        precision mediump float;\n\
        varying vec3 vColor; //obtemos a cor do vertice shader com essa variavel\n\
        void main(void) {\n\
        gl_FragColor = vec4(vColor, 1.); //atribui a cor do pixel para vColor com um compomente de alpha=1 (totalmete opaco)\n\
    }";

    /**
     * @method : getShader
     * usado para compilar um sombreador
     * @param {string} source Códido a ser compilado
     * @param {object} type tipo do objeto referenciado pala biblioteca WebGL
     * @param {string} typeString string descrevendo o tipo do codigo
     */
    var get_shader = function (source, type, typeString) {
        
        var shader = GL.createShader(type);
        
        GL.shaderSource(shader, source);
        GL.compileShader(shader);
        
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("ERRO EM " + typeString + " SHADER : " + GL.getShaderInfoLog(shader));
            return false;
        }
        
        return shader;
    };
    // compilacao do vertice
    var shader_vertex = get_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    // compilacao do fragmento/aresta/pixel
    var shader_fragment = get_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

    // criacao do programa shader
    var SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(SHADER_PROGRAM, shader_vertex);
    GL.attachShader(SHADER_PROGRAM, shader_fragment);
    // vinculacao do programa shader ao WebGL
    GL.linkProgram(SHADER_PROGRAM);

    //obtem os atributos GLSL e os atribui as variaveis
    var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
    var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
    var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");
    var _color   = GL.getAttribLocation(SHADER_PROGRAM, "color");
    var _position= GL.getAttribLocation(SHADER_PROGRAM, "position");

    //ativa atributos GLSL
    GL.enableVertexAttribArray(_color);
    GL.enableVertexAttribArray(_position);
    
    // diz ao contexto WebGL para usar o programa SHADER_PROGRAM para fazer as renderizações na tela
    GL.useProgram(SHADER_PROGRAM);

    /** O Cubo **/
    
    /**
     * @attribute : cube_vertex
     * define os vertices do cubo
     */
    var cube_vertex = [
       // face : posterior // cor : amarelo
       -1,-1,-1,    1,1,0,
        1,-1,-1,    1,1,0,
        1, 1,-1,    1,1,0,
       -1, 1,-1,    1,1,0,
       
       // face : frontal // cor : azul
       -1,-1, 1,    0,0,1,
        1,-1, 1,    0,0,1,
        1, 1, 1,    0,0,1,
       -1, 1, 1,    0,0,1,
       
       // face : esquerda // cor : ciano
       -1,-1,-1,    0,1,1,
       -1, 1,-1,    0,1,1,
       -1, 1, 1,    0,1,1,
       -1,-1, 1,    0,1,1,
       
       // face : direita // cor : vermelho
        1,-1,-1,    1,0,0,
        1, 1,-1,    1,0,0,
        1, 1, 1,    1,0,0,
        1,-1, 1,    1,0,0,

       // face : inferior // cor : roxo
       -1,-1,-1,    1,0,1,
       -1,-1, 1,    1,0,1,
        1,-1, 1,    1,0,1,
        1,-1,-1,    1,0,1,

       // face : superior // cor : verde
       -1, 1,-1,    0,1,0,
       -1, 1, 1,    0,1,0,
        1, 1, 1,    0,1,0,
        1, 1,-1,    0,1,0
    ];

    /**
     * @attribute : @global CUBE_VERTEX
     * define um VBO com as coordenadas do cubo
     * Vertex Buffer of Object => array de vertices WebGL
     */
    var CUBE_VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cube_vertex), GL.STATIC_DRAW);

    
    /**
     * @attribute : cube_faces
     * usa os pontos de triangulos como indices par construir um cuboGL
     * 2 triangulos para cada face
     */
    var cube_faces = [
        0, 1, 2,  // face de posterior
        0, 2, 3,

        4, 5, 6,  // face frontal 
        4, 6, 7,

        8, 9, 10, // face esquerda
        8,10, 11,

        12,13,14, // face direita
        12,14,15,

        16,17,18, // face superior
        16,18,19,

        20,21,22, // face inferior
        20,22,23
    ];
    
    /**
     * @attribute : @global CUBE_FACES
     * define um VBO com as coordenadas das faces do cubo
     * Vertex Buffer of Object => array de vertices WebGL
     */
    var CUBE_FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube_faces), GL.STATIC_DRAW);

    /**
     * @attribute : @global PROJMATRIX
     * Obtem a matri projeção em Z
     * 40 é o angulo da camera em graus
     * a camera só mostra pixes entre zMax e zMin
     */
    var PROJMATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    /**
     * @attribute : @global MOVEMATRIX
     * Matrix de movmentos do cubo
     * Iniciada como matrix identidade
     */
    var MOVEMATRIX = LIBS.get_I4();
    /**
     * @attribute : @global MOVEMATRIX
     * Matrix de movmentos de visualizacao do objeto
     * Iniciada como matrix identidade
     */
    var VIEWMATRIX = LIBS.get_I4();

    // translada em -6
    LIBS.translateZ(VIEWMATRIX, -6);
    var THETA = 0, PHI = 0;

    /** Desenho **/
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    //define cor clara e transparente
    GL.clearColor(0.0, 0.0, 0.0, 0.0);
    GL.clearDepth(1.0);

    var time_old = 0;
    /**
     * @method animate
     * responsavel por desenhar a cena
     */
    var animate = function (time) {
        
        var dt = time - time_old;
        
        if (!drag) {
            dX *= AMORTIZATION;
            dY *= AMORTIZATION;
            THETA += dX, PHI += dY;
        }
        
        LIBS.set_I4(MOVEMATRIX);
        LIBS.rotateY(MOVEMATRIX, THETA);
        LIBS.rotateX(MOVEMATRIX, PHI);
        
        time_old = time;

        // define a area de desenho np canvas e limpa-a
        GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
        GL.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
        GL.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);

        // usa esses pontos par ao proximo desenho
        GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
        //GL.vertexAttribPointer(variavel,dimensao,tipo,normalizador,tamnho total do vertice em bytes,deslocamento)
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 4 * (3 + 3), 0);
        //GL.vertexAttribPointer(variavel,dimensao,tipo,normalizador,tamnho total do vertice em bytes,deslocamento)
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 4 * (3 + 3), 3 * 4);
        
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
        // desenha o cubo
        // chama os 12 triangulos do cubo
        // 6 faces * 2 triangulo por face * 3 pontos por triangulo
        GL.drawElements(GL.TRIANGLES, 6 * 2 * 3, GL.UNSIGNED_SHORT, 0);

        // [ . . . ] // poderia criar mais objetos aqui

        // desnho esta terminado, pronto para renderizar
        GL.flush();

        // redesenha a cena assim que pronta
        window.requestAnimationFrame(animate);
    };
    // pela primeira vez que executado nao tem animação, por isso zero
    animate(0);
};
