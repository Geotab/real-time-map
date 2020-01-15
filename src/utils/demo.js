export const geotab = {

	addin: {

		set realTimeMap(RTM) {

			const { initialize, focus, blur } = RTM();

			const state = {};
			const callback = () => {};
			document.body.style.height = "100vh";

			initialize(api, state, callback);
		}

	},

};

const fakeUserData = {
	companyAddress: "fakeCompanyAddress"
};

const typeNames = {
	"AddInData": [],
	"User": [fakeUserData],
};

const callNames = {

	Get(parameters) {
		const {
			typeName
		} = parameters;

		const result = typeNames[typeName];
		return result;
	},

	GetCoordinates() {
		const y = 43.515228;
		const x = -79.683523;
		return [{ x, y }];
	},

	GetFeed(parameters) {
		const {
			typeName,
			fromVersion,

		} = parameters;

		return [];
		console.warn('51', parameters);
	}
};

export const api = {

	call(call, parameters, resolve, reject) {

		const callHandleFunction = callNames[call];
		const result = callHandleFunction(parameters);

		// console.warn('23', result);
		resolve(result);

	},

	multiCall(calls, resolve, reject) {

		calls.map(eachCall => {
			// console.warn('70', eachCall);
			const [callName, parameters] = eachCall;
			const results = [];
			this.call(callName, parameters, callResult => results.push(callResult), reject);
			resolve(results);
		});

	},

	getSession(callBack) {

		const session = {
			userName: "demoUserName",
			database: "demoDatabase",
			sessionId: "demoSessionId"
		};

		callBack(session);

	}
};
