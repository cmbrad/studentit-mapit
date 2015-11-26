# MapIT Backend API
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
