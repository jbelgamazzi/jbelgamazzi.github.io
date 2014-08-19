
/**
 * @ define onload
 */
window.onload = gamestart();

/**
 * @ define propriedade do cenario do jogo
 */
function scenarioProperty(){
	return new Phaser.Game(1200,600,Phaser.AUTO,'',{
		preload: loadAssets,
		create: createScenario,
		update: updateGame
	});
};

/**
 * @ Method loadAssets()
 * carrega imagens, sons, etc;
 */
function loadAssets(){
	// @ define background image
	game.load.image('background','./assets/background.jpg');
	// @ define ground image
	game.load.image('ground','./assets/ground.jpg');
	// @ define dude image
	game.load.spritesheet('dude','./assets/dude.png',32,48);

};


/**
 * @ Method createBackgroung()
 * cria o background do jogo"
 */
function createBackgroung(){
	// @ insert bacgroud image
	game.add.sprite(0,0,'background');
};

/**
 * @ Method createGround()
 * cria o ground do jogo"
 */
function createGround(){
	// @ define the ground list 
	plataforma = game.add.group();
	// @ define que qualquer obj nesse jogo tem corpo
	plataforma.enableBody = true;
	// @ create ground
	var ground = plataforma.create(0,game.world.height - 30, 'ground');
	// @ define que o ground nao vai se mover se o player pular
	ground.body.immovable = true;
	// @ define escala do ground em relacao ao scenario
	ground.scale.setTo(2,1);
};

/**
 * @ Method createPlayer()
 * cria o player do jogo"
 */
function createPlayer(){
	// @ define player in game
	player = game.add.sprite(50, game.world.height - 250, 'dude');
	// @ define player physic
	game.physics.arcade.enable(player);
	// @ define player bounce
	player.body.bounce.y = 0.2;
	// @ define player gravity
	player.body.gravity.y = 1500;
	// @ define que o player  nao pode salatar para fora da tela
	player.body.collideWorldBounds = true;
	// @ define animação seta esquerda e direita (nome, posicao, fps, true)
	player.animations.add('lefit', [0,1,2,3], 10, true);
	player.animations.add('right', [5,6,7,8], 10, true);
};


/**
 * @ Method createScenario()
 * cria o cenario do jogo"
 */
function createScenario(){
	// @ create background
	createBackgroung();
	// @ create ground 
	createGround();
	// @ create player
	createPlayer();

	// @ define a physic inicial do jogo
	game.physics.startSystem(Phaser.Physics.ARCADE);
	// @ define os cursores que poders ser utilizado
	cursors = game.input.keyboard.createCursorKeys();

};

/**
 * @ Method updateGame()
 * Atualiza o jogo
 * est funcao roda 60fps
 */
function updateGame(){
	// @ define colisao do jogador e plataforma
	game.physics.arcade.collide(player,plataforma);
	// @define movimento do player
	player.body.velocity.x = 0;

	// @ test se a tecla left esta precionada
	if(cursors.left.isDown){
		// @ move player to left
		player.body.velocity.x = -250;
		// @ active left animation
		player.animations.play('left');
	}else if(cursors.right.isDown){
		// @ move player to right
		player.body.velocity.x = 250;
		// @ actve height animation
		player.animations.play('right');
	}else{
		// @ move player to stop
		player.animations.stop();
		// @ active frame 4 of animation (player virado apra frente)
		player.frame = 4;
	}

	// @ active bounce somente quando player esta sobre o graound
	if(cursors.up.isDown && player.body.touching.down){
		// @ defiene bounce (insere eixo y como negativo)
		player.body.velocity.y = -650;
	}

};

/**
 * @ Method gamestart()
 * "Laço principal de jogo"
 */
function gamestart(){
	
	game = scenarioProperty();

};