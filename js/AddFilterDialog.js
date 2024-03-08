class AddFilterDialog
{
    // Add type: exclude or include based on filter
    // list types of filters: attendance option, district, types, name string
    // allow entry of district, type, name, or attendance option

    Type: <label><input type="radio" value="exclude"> Exclude</label> <label><input type="radio" value="include"> Include</label>
    On: <select>
        <option value="attendanceOption">Attendance</option>
        <option value="district_id">District</option>
        <option value="types">Types</option>
        <option value="name">Name contains</option>
    </select>
}