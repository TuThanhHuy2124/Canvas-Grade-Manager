import "./OneTimeInput.css"

/* eslint-disable react/no-unescaped-entities */
// eslint-disable-next-line react/prop-types
function OneTimeInput({setTOKEN, setInsURL}) {
    const saveSensitiveInfo = (e) => {
        setTOKEN(e.target.form[0].value);
        setInsURL(e.target.form[1].value);
        localStorage.setItem("TOKEN", `${e.target.form[0].value}`);
        localStorage.setItem("institutionURL", `${e.target.form[1].value}`);

        location.reload();
    }
    
    return (
        <>
        <form className="oneTimeInput">
            <label htmlFor="token"><a href="https://canvas.instructure.com/doc/api/file.oauth.html#:~:text=To%20manually%20generate%20a%20token%20for%20testing">Token</a>:</label><br/>
            <input id="token" name="token"/><br/>
            <label htmlFor="insURL">Institution's URL:</label><br/>
            <input id="insURL" name="insURL" placeholder="canvas.eee.uci.edu"/><br/>
            <button type="submit" onClick={saveSensitiveInfo}>Submit</button>
        </form>
        <br/>
        </>
    )
}

export default OneTimeInput
