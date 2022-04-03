
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_36(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h72b1d1fbeef9b39d(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_39(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h4b71286e4318823d(arg0, arg1);
}

function __wbg_adapter_42(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h03d86abad69dfe4f(arg0, arg1);
}

function __wbg_adapter_45(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hd406c02a37f7b370(arg0, arg1, addHeapObject(arg2));
}

function getCachedStringFromWasm0(ptr, len) {
    if (ptr === 0) {
        return getObject(len);
    } else {
        return getStringFromWasm0(ptr, len);
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('index-143d2e742e619cb0_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_json_serialize = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = JSON.stringify(obj === undefined ? null : obj);
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_as_number = function(arg0) {
        var ret = +getObject(arg0);
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        var ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        var ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        var ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_null = function(arg0) {
        var ret = getObject(arg0) === null;
        return ret;
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        var ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = typeof(obj) === 'number' ? obj : undefined;
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbg_get_f7833d6ec572e462 = function(arg0, arg1) {
        var ret = getObject(arg0)[takeObject(arg1)];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_fbb49ad265f9dee8 = function(arg0, arg1, arg2) {
        getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
    };
    imports.wbg.__wbindgen_is_falsy = function(arg0) {
        var ret = !getObject(arg0);
        return ret;
    };
    imports.wbg.__wbg_new_693216e109162396 = function() {
        var ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_0ddaca5d1abfb52f = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_09919627ac0992f5 = function(arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
    if (arg0 !== 0) { wasm.__wbindgen_free(arg0, arg1); }
    console.error(v0);
};
imports.wbg.__wbindgen_cb_drop = function(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    var ret = false;
    return ret;
};
imports.wbg.__wbg_clearTimeout_d8b36ad8fa330187 = typeof clearTimeout == 'function' ? clearTimeout : notDefined('clearTimeout');
imports.wbg.__wbg_setTimeout_290c28f3580809b6 = function() { return handleError(function (arg0, arg1) {
    var ret = setTimeout(getObject(arg0), arg1);
    return ret;
}, arguments) };
imports.wbg.__wbg_nodeId_990ad9763621d940 = function(arg0, arg1) {
    var ret = getObject(arg1).$$$nodeId;
    getInt32Memory0()[arg0 / 4 + 1] = isLikeNone(ret) ? 0 : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};
imports.wbg.__wbg_setnodeId_f0d325ec2e8f28e8 = function(arg0, arg1) {
    getObject(arg0).$$$nodeId = arg1 >>> 0;
};
imports.wbg.__wbg_createTextNode_46b48c710b4886d5 = function(arg0, arg1) {
    var ret = getObject(arg0).createTextNode(arg1);
    return addHeapObject(ret);
};
imports.wbg.__wbg_setclassName_755833a3f6c8a86b = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).className = v0;
}, arguments) };
imports.wbg.__wbg_instanceof_Window_434ce1849eb4e0fc = function(arg0) {
    var ret = getObject(arg0) instanceof Window;
    return ret;
};
imports.wbg.__wbg_document_5edd43643d1060d9 = function(arg0) {
    var ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_location_11472bb76bf5bbca = function(arg0) {
    var ret = getObject(arg0).location;
    return addHeapObject(ret);
};
imports.wbg.__wbg_history_52cfc93c824e772b = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).history;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_innerWidth_405786923c1d2641 = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).innerWidth;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_innerHeight_25d3be0d129329c3 = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).innerHeight;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_localStorage_2b7091e6919605e2 = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).localStorage;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_indexedDB_1f37e0a6280bf986 = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).indexedDB;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_matchMedia_646cf522f15a60a9 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var ret = getObject(arg0).matchMedia(v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_scrollTo_0afa369178496d7d = function(arg0, arg1, arg2) {
    getObject(arg0).scrollTo(arg1, arg2);
};
imports.wbg.__wbg_fetch_427498e0ccea81f4 = function(arg0, arg1) {
    var ret = getObject(arg0).fetch(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_body_7538539844356c1c = function(arg0) {
    var ret = getObject(arg0).body;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_createComment_bad521c4f6ab4d4b = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var ret = getObject(arg0).createComment(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_createElement_d017b8d2af99bab9 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var ret = getObject(arg0).createElement(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_createTextNode_39a0de25d14bcde5 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var ret = getObject(arg0).createTextNode(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_getElementById_b30e88aff96f66a1 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var ret = getObject(arg0).getElementById(v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_querySelector_cc714d0aa0b868ed = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var ret = getObject(arg0).querySelector(v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_Response_ea36d565358a42f7 = function(arg0) {
    var ret = getObject(arg0) instanceof Response;
    return ret;
};
imports.wbg.__wbg_json_4ab99130d1a5b3a9 = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).json();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_objectStoreNames_1ffe882c543c8e87 = function(arg0) {
    var ret = getObject(arg0).objectStoreNames;
    return addHeapObject(ret);
};
imports.wbg.__wbg_close_1d91e0dffc2fe875 = function(arg0) {
    getObject(arg0).close();
};
imports.wbg.__wbg_createObjectStore_3f467a432b7cb082 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var ret = getObject(arg0).createObjectStore(v0, getObject(arg3));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_deleteObjectStore_215fad5ca12685a4 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).deleteObjectStore(v0);
}, arguments) };
imports.wbg.__wbg_transaction_6f9cde39be521ffc = function() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).transaction(getObject(arg1), takeObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_open_22435b09dd20255f = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var ret = getObject(arg0).open(v0, arg3 >>> 0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_open_ae7f237eca208633 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var ret = getObject(arg0).open(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new_226d109446575877 = function() { return handleError(function () {
    var ret = new Headers();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_indexNames_71ca6fa6b231d357 = function(arg0) {
    var ret = getObject(arg0).indexNames;
    return addHeapObject(ret);
};
imports.wbg.__wbg_add_c8361d3c9bed0d7a = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).add(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_add_d3927c95dc22a583 = function() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).add(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_createIndex_cdfc79e0557916cd = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    var ret = getObject(arg0).createIndex(v0, v1, getObject(arg5));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_deleteIndex_7768ceb19b6ddd4e = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).deleteIndex(v0);
}, arguments) };
imports.wbg.__wbg_get_4448787e42b51551 = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).get(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_openCursor_c45bc3dbfc7f7b70 = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).openCursor();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_openCursor_45655bade35e20e6 = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).openCursor(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_openCursor_db0cf1632005a0e3 = function() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).openCursor(getObject(arg1), takeObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_setoncomplete_3dc0ba554a7d164a = function(arg0, arg1) {
    getObject(arg0).oncomplete = getObject(arg1);
};
imports.wbg.__wbg_setonerror_2e5cc1fe79f2a88f = function(arg0, arg1) {
    getObject(arg0).onerror = getObject(arg1);
};
imports.wbg.__wbg_objectStore_d9403814ec4c771a = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var ret = getObject(arg0).objectStore(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_length_220ab230736a6183 = function(arg0) {
    var ret = getObject(arg0).length;
    return ret;
};
imports.wbg.__wbg_contains_433a762370f8c0e7 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var ret = getObject(arg0).contains(v0);
    return ret;
};
imports.wbg.__wbg_get_032b639f70dad6f9 = function(arg0, arg1, arg2) {
    var ret = getObject(arg1)[arg2 >>> 0];
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_newwithstrandinit_c07f0662ece15bc6 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    var ret = new Request(v0, getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_pathname_7affbcff36f35c0e = function(arg0, arg1) {
    var ret = getObject(arg1).pathname;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_new_4473c9af1cac368b = function() { return handleError(function (arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    var ret = new URL(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_add_6d3e486d27c81e9e = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).add(...getObject(arg1));
}, arguments) };
imports.wbg.__wbg_add_c1e566b20be6badb = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).add(v0);
}, arguments) };
imports.wbg.__wbg_remove_dd4fc2166fc5de29 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).remove(...getObject(arg1));
}, arguments) };
imports.wbg.__wbg_remove_b4d29ca5eb7db54e = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).remove(v0);
}, arguments) };
imports.wbg.__wbg_toggle_9250fd751885d77b = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var ret = getObject(arg0).toggle(v0);
    return ret;
}, arguments) };
imports.wbg.__wbg_addEventListener_6bdba88519fdc1c9 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).addEventListener(v0, getObject(arg3));
}, arguments) };
imports.wbg.__wbg_rel_355e457aeace06c1 = function(arg0, arg1) {
    var ret = getObject(arg1).rel;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_origin_fe06972a0c4c0960 = function(arg0, arg1) {
    var ret = getObject(arg1).origin;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_pathname_3e89388be77ee96c = function(arg0, arg1) {
    var ret = getObject(arg1).pathname;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_hash_200791f3392df939 = function(arg0, arg1) {
    var ret = getObject(arg1).hash;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_href_cad8f02caf39f2fb = function(arg0, arg1) {
    var ret = getObject(arg1).href;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_setonupgradeneeded_20f0ca679878c9ef = function(arg0, arg1) {
    getObject(arg0).onupgradeneeded = getObject(arg1);
};
imports.wbg.__wbg_classList_5086913f676eb3f3 = function(arg0) {
    var ret = getObject(arg0).classList;
    return addHeapObject(ret);
};
imports.wbg.__wbg_scrollLeft_e8aba47a94d12290 = function(arg0) {
    var ret = getObject(arg0).scrollLeft;
    return ret;
};
imports.wbg.__wbg_scrollWidth_04ef4befe2b4cb32 = function(arg0) {
    var ret = getObject(arg0).scrollWidth;
    return ret;
};
imports.wbg.__wbg_clientWidth_4c903f82634f2159 = function(arg0) {
    var ret = getObject(arg0).clientWidth;
    return ret;
};
imports.wbg.__wbg_setinnerHTML_c80d74e59f460154 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).innerHTML = v0;
};
imports.wbg.__wbg_closest_395c67f32dfd40f1 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var ret = getObject(arg0).closest(v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_removeAttribute_1adaecf6b4d35a09 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).removeAttribute(v0);
}, arguments) };
imports.wbg.__wbg_scroll_d626532f12c35470 = function(arg0, arg1, arg2) {
    getObject(arg0).scroll(arg1, arg2);
};
imports.wbg.__wbg_scrollIntoView_755c41322c787137 = function(arg0, arg1) {
    getObject(arg0).scrollIntoView(arg1 !== 0);
};
imports.wbg.__wbg_setAttribute_1776fcc9b98d464e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    getObject(arg0).setAttribute(v0, v1);
}, arguments) };
imports.wbg.__wbg_remove_b67ae06e76683b10 = function(arg0) {
    getObject(arg0).remove();
};
imports.wbg.__wbg_log_fbd13631356d44e4 = function(arg0) {
    console.log(getObject(arg0));
};
imports.wbg.__wbg_matches_a375878271bc2ba5 = function(arg0) {
    var ret = getObject(arg0).matches;
    return ret;
};
imports.wbg.__wbg_target_e560052e31e4567c = function(arg0) {
    var ret = getObject(arg0).target;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_preventDefault_fa00541ff125b78c = function(arg0) {
    getObject(arg0).preventDefault();
};
imports.wbg.__wbg_result_86c5cd0515f694ca = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).result;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_error_ac777d8b2aa794c6 = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).error;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_transaction_7d4a70db9a6f3213 = function(arg0) {
    var ret = getObject(arg0).transaction;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_setonsuccess_b87f9950da9e0a5b = function(arg0, arg1) {
    getObject(arg0).onsuccess = getObject(arg1);
};
imports.wbg.__wbg_setonerror_71f38880fbcb2f32 = function(arg0, arg1) {
    getObject(arg0).onerror = getObject(arg1);
};
imports.wbg.__wbg_keyCode_8a05b1390fced3c8 = function(arg0) {
    var ret = getObject(arg0).keyCode;
    return ret;
};
imports.wbg.__wbg_altKey_773e7f8151c49bb1 = function(arg0) {
    var ret = getObject(arg0).altKey;
    return ret;
};
imports.wbg.__wbg_ctrlKey_8c7ff99be598479e = function(arg0) {
    var ret = getObject(arg0).ctrlKey;
    return ret;
};
imports.wbg.__wbg_shiftKey_894b631364d8db13 = function(arg0) {
    var ret = getObject(arg0).shiftKey;
    return ret;
};
imports.wbg.__wbg_metaKey_99a7d3732e1b7856 = function(arg0) {
    var ret = getObject(arg0).metaKey;
    return ret;
};
imports.wbg.__wbg_key_7f10b1291a923361 = function(arg0, arg1) {
    var ret = getObject(arg1).key;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_instanceof_Node_235c78aca8f70c08 = function(arg0) {
    var ret = getObject(arg0) instanceof Node;
    return ret;
};
imports.wbg.__wbg_parentNode_a8672a4dfed05ad7 = function(arg0) {
    var ret = getObject(arg0).parentNode;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_nextSibling_c98239511beeadce = function(arg0) {
    var ret = getObject(arg0).nextSibling;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_settextContent_07dfb193b5deabbc = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).textContent = v0;
};
imports.wbg.__wbg_appendChild_3fe5090c665d3bb4 = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).appendChild(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_insertBefore_4f09909023feac91 = function() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).insertBefore(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_removeChild_f4a83c9698136bbb = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).removeChild(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_replaceChild_5760aea7c0896373 = function() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).replaceChild(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_pushState_89ce908020e1d6aa = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    var v1 = getCachedStringFromWasm0(arg4, arg5);
    getObject(arg0).pushState(getObject(arg1), v0, v1);
}, arguments) };
imports.wbg.__wbg_value_eed357d6f4fb271a = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).value;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_key_fab4aae3835e3d00 = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).key;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_advance_519bc6ee1109cbfe = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).advance(arg1 >>> 0);
}, arguments) };
imports.wbg.__wbg_continue_5870a07733ddbae3 = function() { return handleError(function (arg0) {
    getObject(arg0).continue();
}, arguments) };
imports.wbg.__wbg_origin_1bc82542e055b010 = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg1).origin;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_pathname_d0014089875ea691 = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg1).pathname;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_hash_2f90ddae1e6efe5f = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg1).hash;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_getItem_f92ef607397e96b1 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    var ret = getObject(arg1).getItem(v0);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}, arguments) };
imports.wbg.__wbg_setItem_279b13e5ad0b82cb = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    getObject(arg0).setItem(v0, v1);
}, arguments) };
imports.wbg.__wbg_new_16f24b0728c5e67b = function() {
    var ret = new Array();
    return addHeapObject(ret);
};
imports.wbg.__wbg_newnoargs_f579424187aa1717 = function(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    var ret = new Function(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_call_89558c3e96703ca1 = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new_d3138911a89329b0 = function() {
    var ret = new Object();
    return addHeapObject(ret);
};
imports.wbg.__wbg_push_a72df856079e6930 = function(arg0, arg1) {
    var ret = getObject(arg0).push(getObject(arg1));
    return ret;
};
imports.wbg.__wbg_instanceof_ArrayBuffer_649f53c967aec9b3 = function(arg0) {
    var ret = getObject(arg0) instanceof ArrayBuffer;
    return ret;
};
imports.wbg.__wbg_instanceof_Error_4287ce7d75f0e3a2 = function(arg0) {
    var ret = getObject(arg0) instanceof Error;
    return ret;
};
imports.wbg.__wbg_new_55259b13834a484c = function(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    var ret = new Error(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_message_1dfe93b595be8811 = function(arg0) {
    var ret = getObject(arg0).message;
    return addHeapObject(ret);
};
imports.wbg.__wbg_name_66305ab387468967 = function(arg0) {
    var ret = getObject(arg0).name;
    return addHeapObject(ret);
};
imports.wbg.__wbg_toString_3e854a6a919f2996 = function(arg0) {
    var ret = getObject(arg0).toString();
    return addHeapObject(ret);
};
imports.wbg.__wbg_isSafeInteger_91192d88df6f12b9 = function(arg0) {
    var ret = Number.isSafeInteger(getObject(arg0));
    return ret;
};
imports.wbg.__wbg_is_3d73f4d91adacc37 = function(arg0, arg1) {
    var ret = Object.is(getObject(arg0), getObject(arg1));
    return ret;
};
imports.wbg.__wbg_resolve_4f8f547f26b30b27 = function(arg0) {
    var ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};
imports.wbg.__wbg_then_a6860c82b90816ca = function(arg0, arg1) {
    var ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_then_58a04e42527f52c6 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};
imports.wbg.__wbg_self_e23d74ae45fb17d1 = function() { return handleError(function () {
    var ret = self.self;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_window_b4be7f48b24ac56e = function() { return handleError(function () {
    var ret = window.window;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_globalThis_d61b1f48a57191ae = function() { return handleError(function () {
    var ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_global_e7669da72fd7f239 = function() { return handleError(function () {
    var ret = global.global;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_buffer_5e74a88a1424a2e0 = function(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};
imports.wbg.__wbg_new_e3b800e570795b3c = function(arg0) {
    var ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};
imports.wbg.__wbg_set_5b8081e9d002f0df = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};
imports.wbg.__wbg_length_30803400a8f15c59 = function(arg0) {
    var ret = getObject(arg0).length;
    return ret;
};
imports.wbg.__wbg_instanceof_Uint8Array_8a8537f46e056474 = function(arg0) {
    var ret = getObject(arg0) instanceof Uint8Array;
    return ret;
};
imports.wbg.__wbg_set_c42875065132a932 = function() { return handleError(function (arg0, arg1, arg2) {
    var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
}, arguments) };
imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};
imports.wbg.__wbindgen_memory = function() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper1545 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 637, __wbg_adapter_36);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper1788 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 689, __wbg_adapter_39);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper1812 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 694, __wbg_adapter_42);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper4526 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 749, __wbg_adapter_45);
    return addHeapObject(ret);
};

if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
    input = fetch(input);
}



const { instance, module } = await load(await input, imports);

wasm = instance.exports;
init.__wbindgen_wasm_module = module;
wasm.__wbindgen_start();
return wasm;
}

export default init;

