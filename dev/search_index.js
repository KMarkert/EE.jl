var documenterSearchIndex = {"docs":
[{"location":"api/#EarthEngine.jl-API","page":"API","title":"EarthEngine.jl API","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"The EarthEngine.jl API dynamically wraps the EarthEngine Python API, so it defines the types and methods on-the-fly when initializing a session. This means there are few actual Julia functions defined mostly meant to create Julia methods and types from the Python API (see below). ","category":"page"},{"location":"api/","page":"API","title":"API","text":"For more in depth documentation on specific methods for using the EarthEngine API, see the official Earth Engine Documention.","category":"page"},{"location":"api/","page":"API","title":"API","text":"Initialize()","category":"page"},{"location":"api/#EarthEngine.Initialize-Tuple{}","page":"API","title":"EarthEngine.Initialize","text":"Initialize(args...; kwargs...)\n\nFunction to initialize an EarthEngine session (analagous to ee.Initialize() from the Python API). Accepts arguments and keywords from the Python ee.Initialize() function. This function also dynamically builds the EE API and creates the methods  with signatures for each EE Type.\n\n\n\n\n\n","category":"method"},{"location":"api/","page":"API","title":"API","text":"Authenticate()","category":"page"},{"location":"api/#EarthEngine.Authenticate-Tuple{}","page":"API","title":"EarthEngine.Authenticate","text":"Authenticate()\n\nFunction to execute the EarthEngine authetication workflow (analgous to  ee.Authenticate() in the Python API). This function should only be executed once if the EE API has not be used before.\n\n\n\n\n\n","category":"method"},{"location":"api/","page":"API","title":"API","text":"EarthEngine.ee_wrap","category":"page"},{"location":"api/#EarthEngine.ee_wrap","page":"API","title":"EarthEngine.ee_wrap","text":"ee_wrap(pyo::PyObject)\n\nFunction for wrapping a Python object defined in the type map\n\n\n\n\n\n","category":"function"},{"location":"api/","page":"API","title":"API","text":"EarthEngine.pyattr","category":"page"},{"location":"api/#EarthEngine.pyattr","page":"API","title":"EarthEngine.pyattr","text":"pyattr(class method orig_method)\n\nFunction for creating a method signature for a Julia Type In Python world method(T::class) is analagous to class.method()\n\n\n\n\n\n","category":"function"},{"location":"api/","page":"API","title":"API","text":"EarthEngine.@pytype","category":"page"},{"location":"api/#EarthEngine.@pytype","page":"API","title":"EarthEngine.@pytype","text":"@pytype name class\n\nMacro for creating a Julia Type that wraps a PyObject class\n\n\n\n\n\n","category":"macro"},{"location":"api/","page":"API","title":"API","text":"EarthEngine.pyattr_set","category":"page"},{"location":"api/#EarthEngine.pyattr_set","page":"API","title":"EarthEngine.pyattr_set","text":"pyattr_set(types, methods...)\n\nFor each Julia type T<:EEWrapped in types and each method m in methods, define a new function m(t::T, args...) that delegates to the underlying pyobject wrapped by t.\n\n\n\n\n\n","category":"function"},{"location":"api/","page":"API","title":"API","text":"EarthEngine.@pyattr ","category":"page"},{"location":"api/#EarthEngine.@pyattr","page":"API","title":"EarthEngine.@pyattr","text":"@pyattr class method\n\nMacro for creating a method signature for a Julia Type In Python world method(T::class) is analagous to class.method()\n\n\n\n\n\n@pyattr class method orig_method\n\nMacro for creating a method signature for a Julia Type In Python world method(T::class) is analagous to class.method() This will create a new method name which calls the orig_method\n\n\n\n\n\n","category":"macro"},{"location":"usage/#EarthEngine.jl-Usage","page":"Usage","title":"EarthEngine.jl Usage","text":"","category":"section"},{"location":"usage/","page":"Usage","title":"Usage","text":"This document serves to illustrate and discuss some of the internals and interesting bits when using the EarthEngine.jl Julia API. ","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"The Julia API imports the majority of the functions from the Python API (currently missing the modules in ee.Algorithms...). The functions lose the ee.Type syntax so the one can simply call the methods by name and not have as much code. For example ee.Reducer.histogram() is simply histogram() in the Julia API. There are multiple versions of some methods depending on the ee.Type (like mean()) and the differences get handled by Julia's multiple dispatch, see Leveraging Julia's multiple distpatch section for details.","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"Another notable difference is how methods are called. For example, if you would like to filter an ImageCollection and then reduce an Image, the syntax changes from imagecollection.filterDate(start,end).mean() to mean(filterDate(imagecollection, start, end)). This makes the syntax more like native Julia syntax and not object oriented. If you like the Python API of interfacing with EE or want to easily convert your Python code to Julia, then see the Using the Python API through Julia section.","category":"page"},{"location":"usage/#Importing-the-package","page":"Usage","title":"Importing the package","text":"","category":"section"},{"location":"usage/","page":"Usage","title":"Usage","text":"The official name of this package is EarthEngine, this naming convention is used for importing the package to Julia (i.e. using EarthEngine). When getting started, users have to run the function Initialize() to start an Earth Engine session (this is the same in the Python API). Initialize() also dynamically builds the Julia API from the Python API, therefore is can take a few seconds to load. If Initialize() is not run before tying any workflow with EarthEngine, you will get an error: ERROR: ArgumentError: ref of NULL PyObject because the Python API was not loaded into Julia as in the following example:","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"Does not work: ❌","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"using EarthEngine\n\ndem = EE.Image(\"USGS/SRTMGL1_003\")\nERROR: ArgumentError: ref of NULL PyObject\nStacktrace:\n    ...","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"Works: ✅","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"using EarthEngine\n# Intialize the API\nInitialize()\n\ndem = EE.Image(\"USGS/SRTMGL1_003\")\nreturns: EarthEngine.Image(PyObject <ee.image.Image object at ...>)","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"Once imported, the module exports the variable EE which allows for users to access the Earth Engine types in Julia with abbreviated syntax. For example, instead of writting img = EarthEngine.Image() users can write img = EE.Image(). Just for illustration, we can see that the two ways of calling the module are equal:","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"EarthEngine.Image === EE.Image\n# returns: true","category":"page"},{"location":"usage/#EE-Types","page":"Usage","title":"EE Types","text":"","category":"section"},{"location":"usage/","page":"Usage","title":"Usage","text":"One nice feature of  Julia is that it supports types. This allows for easily creating user defined fucntions and code that are type safe. ","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"The Julia types are are one-to-one mapping of the Earth Engine types such as Image, Feature, etc. One can access EE types using the following code: EE.Image (note the capitalized EE). These types are not to be confused with ee.Image which is the original Python object.","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"typeof(ee.Image)\n# returns PyCall.PyObject\n\ntypeof(EE.Image)\n# returns DataType","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"Consider the following example where we define a function that takes an EE.Image type as an input and returns an EE.Image type. This function will return an error if provided any other variable with a type that is not an EE.Image. Here is the following code:","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"# define a function that expects an EE.Image as input and returns EE.Image\nfunction ndvi(img::EE.Image)\n    return normalizedDifference(img, [\"B5\",\"B4\"])\nend\n\n# get an Image and calculate a FeatureCollection\nimg = EE.Image(\"LANDSAT/LC08/C01/T1_TOA/LC08_033032_20170719\")\nfc = sample(img;scale=30,numPixels=500)\n\n# works\nndvi(img)\n# returns: EarthEngine.Image(PyObject <ee.image.Image object at ...>)\n\n# does not work\nndvi(fc)\n#ERROR: MethodError: no method matching ndvi(::EarthEngine.FeatureCollection)\n#Closest candidates are:\n#  ndvi(::EarthEngine.Image) at REPL[XX]:1","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"Again, this allows users to create type safe user defined functions. This also allows users to take advantage of Julia's amazing multiple dispatch feature.","category":"page"},{"location":"usage/#Leveraging-Julia's-multiple-distpatch","page":"Usage","title":"Leveraging Julia's multiple distpatch","text":"","category":"section"},{"location":"usage/","page":"Usage","title":"Usage","text":"Julia's multiple dispatch is a powerful feature that allows users to define multiple functions with the same name but have different functionality depending on the type. Building off of our previous example of calculating NDVI, here we are going to define additional functions called ndvi that perform computations on different types within a workflow:","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"# define an ndvi function to calculate for EE.FeatureCollection\nfunction ndvi(fc::EE.FeatureCollection)\n    # map the ndvi-feature function over the fc\n    return map(fc,ndvi)\nend\n\n# define ndvi function to calculate from two Numbers\nfunction ndvi(nir::EE.Number,red::EE.Number)\n    # compute ndvi from numbers\n    return divide(subtract(nir,red),add(nir,red))\nend\n\n# define an ndvi function to calculate for EE.Feature\nfunction ndvi(f)\n    f = EE.Feature(f) # cast type here so we can use EE.map\n    r = EE.Number(get(f,\"B4\"))\n    n = EE.Number(get(f,\"B5\"))\n    # apply ndvi-number function\n    val = ndvi(n,r)\n    return set(f,\"ndvi\",val)\nend\n\n# input a FeatureCollection into ndvi\nndvi_fc = ndvi(fc)\n# returns: EarthEngine.FeatureCollection(PyObject <ee.featurecollection.FeatureCollection object at ...>)","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"If you are used to Python then this code should not work (at least not return a FeatureCollection). We clearly defined ndvi multiple times and the last definition should not work with a FeatureCollection...so how does it work!? This is the power of multiple dispatch! By providing types Julia is able to determine which function to use depending on the input values.","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"We can check the different signatures of the function ndvi with the following code:","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"# check the signatures of `ndvi`\nmethods(ndvi)\n# # 4 methods for generic function \"ndvi\":\n# [1] ndvi(img::EarthEngine.Image) in Main at REPL[XX]:2\n# [2] ndvi(fc::EarthEngine.FeatureCollection) in Main at REPL[XX]:2\n# [3] ndvi(nir::EarthEngine.Number, red::EarthEngine.Number) in Main at REPL[XX]:2\n# [4] ndvi(f) in Main at REPL[XX]:2","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"If you are interested in learning more about mulitple dispatch, then pleae see the following presentation: The Unreasonable Effectiveness of Multiple Dispatch by Stefan Karpinski.","category":"page"},{"location":"usage/#Quirks","page":"Usage","title":"Quirks","text":"","category":"section"},{"location":"usage/#Constructors-with-multiple-dispatch","page":"Usage","title":"Constructors with multiple dispatch","text":"","category":"section"},{"location":"usage/","page":"Usage","title":"Usage","text":"Due to Juia's multiple dispathcing based on type, sometimes you will have to provide a type as the first argument into a constructor method for an EE object. For example, the function gt() has multiple uses: you can compared Images, Arrays, Numbers, etc. but there is also an EE.Filter constructor that we can create with gt(). If you try to create a filter using the keyword arguments as inputs, such as gt(;name=\"B4\",value=0.05), you will get an error because Julia cannot figure out which method signature to use. To overcome this, one can simply provide a blank object of the desired type as in below:","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"filter = gt(EE.Filter(); name=\"B4\", value=0.05)","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"Julia will determine which method signature to use based on which type is provided, i.e. toList(EE.Reducer()) will return a reducer rather than a list.","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"When in doubt, you can always provide the EE.Type as the first argument when creating a new object. In reality, it is probably best practice so that the code is more readable by users. Say we want to create a constant image, the two following lines of code are both valid:","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"one = constant(1)\none = constant(EE.Image(),1)","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"The method constant() is only used to create an image within Earth Engine but providing the type allows for the signature to be defined and it is easy for readers to understand what constant is doing, ultimately making code more maintainable. ","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"There are more likely than not more quirks in using the EE API this way, these are some that have been found so far. If there is a question or some unexpected behavior please file an issue on the GitHub repo","category":"page"},{"location":"usage/#Using-the-Python-API-through-Julia","page":"Usage","title":"Using the Python API through Julia","text":"","category":"section"},{"location":"usage/","page":"Usage","title":"Usage","text":"The EarthEngine.jl package also exposes the ee Python module so one can use the same code as one would when programming in Python. See the following example of valid Julia and Python code:","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"# import the EE package and Initialize an ee session\n# this is the only non-Python\nusing EarthEngine\nInitialize()\n\n# now we can access the `ee` module like we would with Python\ndem = ee.Image(\"USGS/SRTMGL1_003\");\nxy = ee.Geometry.Point(86.9250, 27.9881);\nvalue = dem.sample(xy,scale=30).first().get(\"elevation\")\nprintln(value.getInfo())\n# 8729 ","category":"page"},{"location":"usage/","page":"Usage","title":"Usage","text":"Accessing the EE API this way is an exact match to the Python API so one can simply copy-paste whatever Python code you have using the ee module and it will work with this Julia API.","category":"page"},{"location":"#EarthEngine.jl","page":"Home","title":"EarthEngine.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Google Earth Engine in Julia!","category":"page"},{"location":"","page":"Home","title":"Home","text":"EarthEngine.jl is used to interface with the amazing cloud-based geospatial processing platform, Google Earth Engine, using the Julia programming language as a wrapper aroung the EE Python API. ","category":"page"},{"location":"","page":"Home","title":"Home","text":"You can use EarthEngine.jl in the following two ways.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Interface with the good ole' object-oriented Python API that everyone knows and loves through Julia (i.e. imagecollection.filterDate(...).mean())\nInterface with EarthEngine using with Julia-like syntax that leverages types and multiple dispacthing (i.e. mean(filterDate(imagecollection,...))).","category":"page"},{"location":"","page":"Home","title":"Home","text":"See the Usage section of the documentation for more details on how to use.","category":"page"},{"location":"#Why-Julia-Earth-Engine?","page":"Home","title":"Why Julia + Earth Engine?","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The officially supported Earth Engine APIs are written in JavaScript and Python. These APIs provide great interfaces to the platform but limits some developers to those languages. Other community developed APIs have been developed ,like rgee, and allow developers to interface with EE in their favorite languages. This package provides the EarthEngine API for users who love programming in Julia!","category":"page"},{"location":"","page":"Home","title":"Home","text":"Julia is a modern programming language that has the feel of a scripting language with the performance compiled languages (thanks to its JIT compilation). Julia is full of features with a couple of particular interest such as types and multiple dispatch that this package leverages to make developing EE workflows more expressive.","category":"page"},{"location":"#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"To use EarthEngine with Julia, we will use the existing Python API and call the functions through Julia. This is done through Julia’s PyCall package but we will need to install the EE API for use within the Julia environment. To do this using the following instructions:","category":"page"},{"location":"","page":"Home","title":"Home","text":"$ julia\njulia> ]\npkg> add PyCall Conda\njulia> using Conda\njulia> Conda.add(\"earthengine-api\",channel=\"conda-forge\");","category":"page"},{"location":"","page":"Home","title":"Home","text":"Now we can install the EE package. The EarthEngine.jl package is currently going through the process to be part of the official Julia package registry, until that is finished you can install directly from Github using the following code:","category":"page"},{"location":"","page":"Home","title":"Home","text":"$ julia\njulia> ]\npkg> add https://github.com/Kmarkert/EarthEngine.jl\njulia> using EarthEngine","category":"page"},{"location":"","page":"Home","title":"Home","text":"If everything went well then you should have been able to import the EE package without any errors.","category":"page"},{"location":"#Quick-start","page":"Home","title":"Quick start","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"To get started illustrating how to execute EE workflows using Julia, some of the examples using the Python API are replicated using the EE Julia API.","category":"page"},{"location":"#Test-the-API","page":"Home","title":"Test the API","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The first example is focused on importing the packing and performing a small geospatial process. Here the SRTM elevation data is imported and queried at the geospatial coordinates of Mount Everest to get the elevation value.","category":"page"},{"location":"","page":"Home","title":"Home","text":"using EarthEngine\nInitialize()\ndem = EE.Image(\"USGS/SRTMGL1_003\")\nxy = Point(86.9250, 27.9881)\nvalue = get(first(sample(dem,xy,30)),\"elevation\")\nprintln(getInfo(value))\n# should print: 8729","category":"page"},{"location":"#Plotting-data-from-EE","page":"Home","title":"Plotting data from EE","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"As a more extensive example, we will sample data from a raster dataset. This is a common workflow for geospatial sciences whether looking at relationships between variables or sampling data for ML workflows. Here we load in Landsat image, sample band values, and plot the relationship of the bands.","category":"page"},{"location":"","page":"Home","title":"Home","text":"using Plots\nusing EarthEngine\nInitialize()\nimg = EE.Image(\"LANDSAT/LT05/C01/T1_SR/LT05_034033_20000913\")\nband_names = EE.List([\"B3\",\"B4\"])\nsamples_fc = sample(divide(select(img,band_names),10000);scale=30,numPixels=500)\nreducer = repeat(toList(EE.Reducer()),length(band_names))\nsample_cols =  EE.Dictionary(reduceColumns(samples_fc, reducer, band_names))\nsample_data = getInfo(get(sample_cols,\"list\"))\n\n# plot the results\ntheme(:bright)\nscatter(sample_data[1,:],sample_data[2,:],markersize=4,alpha=0.6,xlabel=\"Red\",ylabel=\"NIR\",leg=false)","category":"page"},{"location":"","page":"Home","title":"Home","text":"The results should look like the following figure:","category":"page"},{"location":"","page":"Home","title":"Home","text":"(Image: example_scatterplot)","category":"page"},{"location":"#Image-processing-and-visualization","page":"Home","title":"Image processing and visualization","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"This next example is a common workflow to calculate NDVI from a Landsat 5 image. For this example we define a function, apply it to the image, and pull the results for visualization.","category":"page"},{"location":"","page":"Home","title":"Home","text":"using Plots, Colors, FileIO\nusing EarthEngine\nInitialize()\n\nimg = EE.Image(\"LANDSAT/LT05/C01/T1_SR/LT05_034033_20000913\")\n\nfunction ndvi(img::EE.Image)\n    return normalizedDifference(img, [\"B4\",\"B3\"])\nend\n\nndvi_img = ndvi(img)\n\ncolor_map = map(x -> hex(x,:RRGGBB), cgrad(:Greens_9));\n\nthumburl = getThumbUrl(\n    ndvi_img, \n    Dict(\n        \"min\" => 0,\n        \"max\" => 0.8,\n        \"dimensions\" => 1024,\n        \"palette\" => color_map,\n        \"format\" => \"png\",\n    )\n)\nlocalpath = download(thumburl)\n\npng = FileIO.load(localpath);\n\nplot(png, ticks = nothing, border = :none)","category":"page"},{"location":"","page":"Home","title":"Home","text":"The results should look like the following image:","category":"page"},{"location":"","page":"Home","title":"Home","text":"(Image: example_ndvi)","category":"page"},{"location":"#Acknowlegments","page":"Home","title":"Acknowlegments","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"This package is heavily influenced by many of the great developer resources created by the Earth Engine community such as rgee and other packages in the Google Earth Engine Community Org\nA lot of code was reused from Pandas.jl which illustrates how to wrap Python objects in Julia.","category":"page"}]
}
