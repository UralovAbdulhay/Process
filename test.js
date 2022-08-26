/* CORE||DO_REACT|slave_id<ARMY2.13>,fraction<255>,owner<ITV8>,module<map.run>,action<ADD_MONITOR>,
date<20-02-19>,param3_val<1>,param2_val<ARMY2>,param1_val<1>,param0_val<13>,guid_pk<{59C900FA-CC34-E911-81BB-C81F66E82934}>,
param3_name<manual>,param2_name<sender>,param1_name<user_id>,param0_name<from_map>,core_global<1>,source_type<CAM>,
params<4>,source_id<800>,time<10:04:21> */

slaves = "ARMY2:48-126;125,ARRIVAL:2-24;23,ARRIVAL:7-13;12,SYSADMINPC:2-24;23,SYSADMINPC:7-13;12,ARMY2:2-24;23,ARMY2:7-13;12,ARMY2:32-132;18,SUPERVISOR:2-24;23,SUPERVISOR:7-13;12,OPERATOR6:2-24;23,OPERATOR6:7-13;12,OPERATOR4:2-24;23,OPERATOR4:7-13;12,OPERATOR5:2-24;23,OPERATOR5:7-13;12,OPERATOR3:2-24;23,OPERATOR3:7-13;12,OPERATOR2:2-24;23,OPERATOR2:7-13;12,ITVCLIENT2:2-24;23,ITVCLIENT2:7-13;12,CLIENTARMY3:3-55;4,CLIENTARMY3:32-132;18,BORDERCLIENT:6-59;10,CLIENTARMY1:3-55;4,CLIENTARMY1:32-132;18,OKPVIR:2-24;23,OKPVIR:7-13;12,"; //имя компа:номер экрана-монитор добавления;монитор просмотора, и т.д.
//maxcam=9; //count of lines

if (Event.SourceType == "DISPLAY" && Event.Action == "ACTIVATE") {
    slave = Event.GetParam("slave_id");
    Var_var("disp" + slave) = Event.SourceId;
}

if (Event.SourceType == "MACRO" && Event.Action == "RUN" && Event.SourceId == "7") {
    slave = Event.GetParam("slave_id").split(".")[0];
    mon = findslave(slaves, slave, Var_var("disp" + slave));
    if (mon != 0) {
        slave = Event.GetParam("slave_id").split(".")[0];
        mon = mon.split(";")[0];
        DoReactStr("MONITOR", mon, "REMOVE_ALL", "__slave_id<" + slave + ">");
        Var_var("cams") = "";
    }
}

if (Event.SourceType == "MAP" && Event.Action == "OBJDBLCLK" && Event.GetParam("objtype") == "CAM") {
    cam = Event.GetParam("objid");
    slave = Event.GetParam("slave_id").split(".")[0];
    log(slave);
    mon = findslave(slaves, slave, Var_var("disp" + slave));
    if (mon != 0) {
        mon = mon.split(";")[1];
        DoReactStr("MONITOR", mon, "REMOVE_ALL", "__slave_id<" + slave + ">");
        DoReactStr("MONITOR", mon, "ADD_SHOW", "cam<" + cam + ">,__slave_id<" + slave + ">");
//DoReactStr("MONITOR",mon,"ACTIVATE","__slave_id<"+slave+">,topmost<1>");
    }
}

/*if (Event.SourceType == "DISPLAY" &&  Event.Action == "ACTIVATE")
{
slave=Event.GetParam("slave_id");
mon=findslave(slaves,slave).split(";")[1];
DoReactStr("MONITOR",mon,"DEACTIVATE","__slave_id<"+slave+">");
}
*/
if (Event.SourceType == "CORE" && Event.Action == "DO_REACT" && Event.GetParam("action") == "ADD_MONITOR") {
    log("!!!!");
    cam = Event.GetParam("source_id");
    slave = Event.GetParam("slave_id").split(".")[0];
    log(slave + " - " + Var_var("cams"));

    mon = findslave(slaves, slave, Var_var("disp" + slave));
    if (mon != 0) {
        mon = mon.split(";")[0];
        maxcam = GetObjectParam("MONITOR", mon, "max_cams");
        if (maxcam != Var_var("maxcam")) {
            Var_var("cams") = "";
            Var_var("maxcam") = maxcam;
        }

        if (find(Var_var("cams"), cam) == 0) {
            cams = Var_var("cams").split(",");
            if (cams.length == maxcam) {
                Var_var('cams') = Remove(Var_var('cams'));
                log("REMOVE: " + Var_var('cams'));
                DoReactStr("MONITOR", mon, "REMOVE", "cam<" + cams[0] + ">,__slave_id<" + slave + ">");
            }
            Var_var("cams") = Add(Var_var("cams"), cam);
            log("ADD: " + Var_var('cams'));
            DoReactStr("MONITOR", mon, "ADD_SHOW", "cam<" + cam + ">,__slave_id<" + slave + ">");
        }
    }
}

if (Event.SourceType == "CORE" && Event.Action == "DO_REACT" && Event.GetParam("action") == "REMOVE_MONITOR") {
    log("!!!!");
    cam = Event.GetParam("source_id");
    slave = Event.GetParam("slave_id").split(".")[0];
    log(slave + " - " + Var_var("cams"));

    mon = findslave(slaves, slave, Var_var("disp" + slave));
    if (mon != 0) {
        mon = mon.split(";")[0];
        Var_var('cams') = Remove1(Var_var('cams'), cam);
        log("REMOVE: " + Var_var('cams'));
        DoReactStr("MONITOR", mon, "REMOVE", "cam<" + cam + ">,__slave_id<" + slave + ">");
    }
}


function Add(src_arr, val) {
    var ss = src_arr.split(",");
    if (ss.length == 1 && ss[0] == "") {
        ss[0] = val;
    } else {
        ss[ss.length] = val
    }
    return ss;
}

function Remove(src_arr) {
    var ss = src_arr.split(",");
    for (i = 0; i < ss.length - 1; i++) {
        ss[i] = ss[i + 1];
    }
    ss.length = i;
    return ss;
}

function Remove1(src_arr, val) {
    var ss = src_arr.split(",");
//log("Len="+ss.length);
    for (var i = 0; i < ss.length; i++) {
        if (ss[i] == val) {
            ss.splice(i, 1);
            return ss;
        }
    }
    return ss + "";
}

function find(list, id) {
    var ss = list.split(",");
    for (var i = 0; i < ss.length; i++) {
//DebugLogString(ss[i]);
        if (ss[i] == id) {
            return ss[i];
        }
    }
    return 0;
}

function findslave(list, id, disp) {
    var ss = list.split(",");
    for (i = 0; i < ss.length; i++) {
//DebugLogString(ss[i]);
        if (ss[i].indexOf(id + ":" + disp + "-") != -1) {
            return ss[i].split("-")[1];
        }
    }
    return 0;
}


function log(s) {
    DebugLogString(s);
}

