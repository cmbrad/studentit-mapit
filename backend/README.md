# MapIT Backend API
## Description
REST API designed to supply data to the frontend Polymer based MapIT application.  
Implemented using the rails-api gem, hopefully will switch to Rails 5 where it's inbuilt once it finally releases.

## Setup
1. bundle install  
2. rake db:setup  
3. rake bookit:import  
4. rake db:seed  

## Routes
### Library
/library  
Returns a list of all information for all libraries.  
```
{
	"version": 1,
	"libraries": [
		{
			"id":   0,
			"name": "Baillieu",
			"levels": [
				{
					"id":    0,
					"name":  "G",
					"order": 0
				},
				...
			]
		},
		...
	]
}
```

/library/<library_id>  
Returns a list of all information for the specified library.  
```
{
	"version": 1,
	"libraries": [
		{
			"id":   0,
			"name": "Baillieu",
			"levels": [
				{
					"id":    0,
					"name":  "G",
					"order": 0
				},
				...
			]
		}
	]
}
```

### Resource
/resource/  
```
{
	"version": 1,
	"resources": [
		{
			"id":          0,
			"name":       "",
			"library_id": "",
			"level_id":   "G"
		},
		...
	]
}
```

/resource/<resource_id>  
```
```

/resource/level
```
{
	"version": 1,
	"resources": [
		{
			"id":
			"name":
			"levels":
		}
	]
}
```

/resource/level/<level_id>
```
{
	"version": 1,
	"resources": [
		{
			"id"::
			"name":
			"levels":
		}
	]
}
```

/resource/location
```

```

/resource/location/<location_id>
```

```

### Search
/search/
```

```
