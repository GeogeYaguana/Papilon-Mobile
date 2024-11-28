if(NOT TARGET react-native-reanimated::reanimated)
add_library(react-native-reanimated::reanimated SHARED IMPORTED)
set_target_properties(react-native-reanimated::reanimated PROPERTIES
    IMPORTED_LOCATION "/home/georgeyaguana/Escritorio/Proyectos/Proyectos_laborables/papilonMobile/node_modules/react-native-reanimated/android/build/intermediates/cxx/Debug/z285h4c4/obj/x86_64/libreanimated.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/georgeyaguana/Escritorio/Proyectos/Proyectos_laborables/papilonMobile/node_modules/react-native-reanimated/android/build/prefab-headers/reanimated"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

if(NOT TARGET react-native-reanimated::worklets)
add_library(react-native-reanimated::worklets SHARED IMPORTED)
set_target_properties(react-native-reanimated::worklets PROPERTIES
    IMPORTED_LOCATION "/home/georgeyaguana/Escritorio/Proyectos/Proyectos_laborables/papilonMobile/node_modules/react-native-reanimated/android/build/intermediates/cxx/Debug/z285h4c4/obj/x86_64/libworklets.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/georgeyaguana/Escritorio/Proyectos/Proyectos_laborables/papilonMobile/node_modules/react-native-reanimated/android/build/prefab-headers/worklets"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

