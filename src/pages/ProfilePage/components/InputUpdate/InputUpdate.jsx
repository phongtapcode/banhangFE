import "./InputUpdate.scss";

function InputUpdate({title,classIcon,name,onChange,value}) {

    const handleChange = (e) => {
        onChange(e.target.name,e.target.value)
    }

  return (
    <>
      <h1 className="profile__title">{title}</h1>
      <div className="profile__item">
      <i className={classIcon}></i>
        <input value={value} type="text" placeholder={name} name={name} onChange={handleChange}/>
      </div>
    </>
  );
}

export default InputUpdate;
