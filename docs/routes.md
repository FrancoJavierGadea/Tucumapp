# Routes


### API

```txt
/data/{category}/{line}/{direction}/{data_type}.geojson
```

- `{category}` es `urbano` `interurbano` `rural`

- `{line}` es el **número del colectivo** o su **nombre**

   Ej: `103` `1` `3` `9` `el-provincial`

- `{direction}` es es recorrido

   Ej: `horario` `anti-horario` `lavalle`, `las-piedras` `viamonte`

- `{data_type}` es el tipo de datos que se quiere obtener, `recorrido` o `paradas`

