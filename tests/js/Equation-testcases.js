/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/
tests.runEquationTests = function(){
	var checkIfSame = function( func, str, expect ){
		var result = func( str );
		var errMsg = "`" + str + "` failed to match object." ;
		if( mixin.areObjectsSame( result, expect ) ){
			ok( true );
		}else{
			if( JSON.stringify ){
				equal( JSON.stringify( result ), JSON.stringify( expect ), errMsg );
			}else{
				ok( false, errMsg + " Note: Use browser with `JSON.stringify` support for more details");
			}
		}
	};
	module( "Equation Class: Checking input" );
	test( "test Equation.hasManyCompares() with 1 compare", function(){
		var func = Equation.hasManyCompares;
		equal( func( "a < b" ), false );
		equal( func( "a > b" ) , false );
		equal( func( "a = b" ) , false );
		
		equal( func( "a >= b" ) , false );
		equal( func( "a <= b" ) , false );
		
		equal( func( "a = < b" ), true );
		equal( func( "a => b" ), true );
	});
	test( "test Equation.hasManyCompares() with many compares", function(){
		var func = Equation.hasManyCompares;
		equal( func( "a << b" ), true );
		
		equal( func( "a < < b" ), true );
		equal( func( "a >> b" ), true );
		equal( func( "a > > b" ), true );
		
		equal( func( "a == b" ), true );
		equal( func( "a = = b" ), true );
		equal( func( "a >=>= b" ), true );
		
		equal( func( "a <=<= b" ), true );
		equal( func( "a > b > c" ), true );
		equal( func( "a > b < c" ), true );
		
		equal( func( "a < b < c" ), true );
	});
	test( "test Equation.hasIncompleteBinaryOperator() with valid expressions.", function(){
		var func = Equation.hasIncompleteBinaryOperator;

		equal( func( "+a - b" ), false );
		equal( func( "a + b" ), false );
		equal( func( "a < b" ), false );
		equal( func( "a > b" ), false );
		equal( func( "a >= b" ), false );
		equal( func( "a = 1" ), false );
		equal( func( "a - b + 1 > c + 1e34" ), false );
	});
	test( "test Equation.hasIncompleteBinaryOperator() with invalid expressions.", function(){
		var func = Equation.hasIncompleteBinaryOperator;
		
		equal( func( "a b" ), true );
		equal( func( "a b > c" ), true );
		equal( func( "a + b < c d" ), true );
		equal( func( "a-" ), true );
		equal( func( "a+" ), true );
		equal( func( "a+ < c-" ), true );
		equal( func( "a+ b -= c" ), true );
		equal( func( "a+ b += c" ), true );
	});
	test( "test that Equation.getErrorMessage() ", function(){
		var func = Equation.getErrorMessage;
		ok( !func( "a+b" ) );
		ok( func( "a b" ) );
		ok( func( "a * b" ) );
		ok( func( "a + b+" ) );
	});
	test("test Equation.getErrorMessage() with valid input.", function(){
		var func = Equation.getErrorMessage;
		var x;
		equal( func( "a < c" ), x );
		equal( func( "a > c" ), x );
		equal( func( "a <= c" ), x );
		
		equal( func( "a >= c" ), x );
		equal( func( "a = c" ), x );
		equal( func( "a < c + 12" ), x );
		
		equal( func( "a - 3 > c" ), x );
		equal( func( "12 + 2 <= c" ), x );
		equal( func( "2 >= 1" ), x );
		
		equal( func( "13 = 13" ), x );
	});
	test("test Equation.checkInput() will throw an error when Equation.getErrorMessage returns a message.", function(){
		var args = "error";
		var oldFunc = Equation.getErrorMessage;
		Equation.getErrorMessage = function(){
			return args;
		};
		var func = Equation.checkInput;
		try{
			raises(function(){
				func();
			});
			args = "";
			ok(	!func() );
		}
		catch(e){
		}
		Equation.getErrorMessage = oldFunc;
	});
	test("test Equation.parseToObject() with valid expressions", function(){
		var func = Equation.parseToObject;
		var y = {
			rhs: {
				terms:{
					"1": 0
				}
			},
			lhs : {
				terms:{
					"x1":10,"x2":-2, "1":-10
				}
			},
			relation:"="
		};
		var x = func("10x1 -2x2 - 10");
		deepEqual( x.rhs.terms, y.rhs.terms );
		deepEqual( x.lhs.terms, y.lhs.terms );
		deepEqual( x.relation, y.relation );
	});
	test("test Equation.parseToObject() with different compares", function(){
		var func = Equation.parseToObject;


		checkIfSame( func, "2a + 3b <= 30", {
			lhs:{terms:{ "a":2,"b":3}},
			rhs:{terms:{ "1":30 }},
			relation:"<="
		});
		checkIfSame( func, "2a - 30 >= 4 + a2", {
			lhs:{terms:{ "a":2, "1": -30 }},
			rhs:{terms:{ "a2": 1, "1": 4 }},
			relation:">="
		});
		checkIfSame( func, "2a - 30 > 4 + a2", {
			lhs:{terms:{ "a":2, "1": -30 }},
			rhs:{terms:{ "a2": 1, "1": 4 }},
			relation:">"
		});
		checkIfSame( func, "2a - 30 < 4 + a2", {
			lhs:{terms:{ "a":2, "1": -30 }},
			rhs:{terms:{ "a2": 1, "1": 4 }},
			relation:"<"
		});
		checkIfSame( func, "2a + 12 = 2a + 12", {
			lhs:{terms:{ "a":2, "1": 12 }},
			rhs:{terms:{ "a":2, "1": 12 }},
			relation:"="
		});
	});
	test("test Equation.getTermNames()", function(){
		var func = function( str ){
			return Equation.parse( str ).getTermNames();
		};
		deepEqual( func( "a" ), ["a"] );
		deepEqual( func( "2x1 + x2 + x3 <= 14" ), ["x1","x2","x3", "14"] );
	});
	test("test Equation.parse()", function(){
		var func = function(str){
			return Equation.parse(str);
		};
		var x = func( "2x1 + x2 + x3 <= 14" );
		deepEqual( x.leftSide.toString(), "2x1 + x2 + x3" );
		deepEqual( x.rightSide.toString(), "14" );
		deepEqual( x.relation.toString(), "<=" );
	});
	test("test Equation.prototype.toString()", function(){
		var func = function( str ){
			return Equation.parse( str ).toString();
		};
		equal( func( "a+3<=3b"), "a + 3 <= 3b" );
		equal( func( "-1.4e+ 4 +23.9e4 + a4 -d3 -3e+49 = 3"), "a4 - d3 - 1.4e - 3e+49 = 3" );
	});
	
	test( "test Equation.prototype.moveVariableToOneSide()", function(){
		var func = function( str, isLeft ){
			return Equation.parse(str).moveVariableToOneSide(isLeft).toString();
		};
		equal( func( "a <= 30", true ), "a <= 30", "vars on left" );
		equal( func( "a <= 30", false ), "0 <= -a + 30", "vars on right" );
		
		equal( func( "a + 4b - c <= 30 + a", false ), "0 <= -4b + c + 30", "right" );
		equal( func( "4a + 3 - 94c <= 30 + 43", false ), "3 <= -4a + 94c + 73", "right" );
	});
	test( "test Equation.protype.convertTo() with two term equations", function(){
		var func = function( str, varsSide, constantsSide, relation ){
			return Equation.parse(str).convertTo(varsSide, constantsSide, relation).toString();
		};
		equal( func( "a <= 30", "left", "right" ), "a <= 30" );
		equal( func( "a <= 30", "right", "left" ), "-30 <= -a" );
		equal( func( "a <= 30", "right", "left", ">=" ), "30 >= a" );
	});
	test( "test Equation.protype.convertTo() with two or more terms equations", function(){
		var func = function( str, varsSide, constantsSide, relation ){
			return Equation.parse(str).convertTo(varsSide, constantsSide, relation).toString();
		};
		equal( func( "a - 10 <= 20", "right", "left", ">=" ), "-30 >= -a" );
		equal( func( "a - 10 <= 20", "left", "right" ), "a <= 30" );
		equal( func( "a - 10 = 20", "right", "left" ), "30 = a" );
		equal( func( "a - 10 = 20", "left", "left" ), "a - 30 = 0" );
		equal( func( "a - 10 = 20", "right", "right" ), "0 = -a + 30" );
	});
	test( "test Equation.protype.getStandardMaxForm()", function(){
		var func = function( str ){
			return Equation.parse(str).getStandardMaxForm();
		};
		equal( func( "a - 10 <= 20" ), "a <= 30" );
		equal( func( "-1 + a < 21" ), "a <= 30" );
		equal( func( "a + b - 10 >= 0" ), "a + b <= 10" );
	});
};