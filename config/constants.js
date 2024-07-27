//setting up keys and their values for development
module.exports = {

	'STATUS': {'INACTIVE': 0 , 'ACTIVE': 1, 'DE_ACTIVE': 2},
	'PAGE_DATA_LIMIT': 10,
	'DATA_LIMIT': 6,
	'PAGE': 1,
	'LIMIT': 10,
	'DEFAULT_LANGUAGE': "en",
	'APP_LANGUAGE': ['en', 'hn'],
	'URL_EXPIRE_TIME': '2h',
	'PROGRAM_DEFAULT_STATUS': 'program_remaing',
	'WORKOUT_DEFAULT_STATUS': 'workout_remaing',
	'DRILL_DEFAULT_STATUS': 'drill_remaing',
	'USER_TYPE': {
		'ADMIN': 1,
		'USER': 2
	},
	'STATUS_CODE': {
		'SUCCESS': '1',
		'FAIL': '0',
		'VALIDATION': '2',
		'UNAUTHENTICATED': '-1',
		'NOT_FOUND': '-2'
	},
	'WEB_STATUS_CODE': {
		'OK': 200,
		'CREATED': 201,
		'NO_CONTENT': 204,
		'BAD_REQUEST': 400,
		'UNAUTHORIZED': 401,
		'NOT_FOUND': 404,
		'SERVER_ERROR': 500
	},
	'VERSION_STATUS': {
		'NO_UPDATE': 0,
		'OPTIONAL_UPDATE': 1,
		'FORCE_UPDATE': 2,
	},
	'DEVICE_TYPE' : {
		'ANDROID' : 1,
		'IOS' : 2,
	},
	'FS_TYPES': {
        'DIR': 'DIR',
        'FILE': 'FILE'
	},
	'LANG': {
		'HINDI': 'hn',
		'ENGLISH': 'en'
	}
}