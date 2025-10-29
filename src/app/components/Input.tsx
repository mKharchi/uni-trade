import React from 'react';
import styled from 'styled-components';

const Input = ({
  name, label, value, onChange, type
}: {
  name: string;
  label: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) => {
  return (
    <StyledWrapper className='w-full'>
      <div className="form-control w-full ">
        <input
          className=""
          name={name}
          type={type || "text"}
          value={value}
          onChange={onChange}
          required
          autoComplete="off"
          autoCapitalize="none"
          autoFocus={false}
          autoCorrect="off"

          spellCheck={false}
        />
        <label>
          <span style={{ transitionDelay: '0ms' }}>{label}</span>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .form-control {
    position: relative;
    margin: 0px 0px 10px 0px;
  }

  .form-control input {
    background-color: transparent;
    border: 0;
    border-bottom: 1px #121212 solid;
    display: block;
    width: 100%;
    padding: 15px 0;
    font-size: 18px;
    color: #121212;
  }

  .form-control input:focus,
  .form-control input:valid {
    outline: 0;
    border-bottom-color: lightblue;
  }

  .form-control label {
    position: absolute;
    top: 15px;
    left: 0;
    pointer-events: none;
  }

  .form-control label span {
    display: inline-block;
    font-size: 18px;
    min-width: 5px;
    color: #00;
    transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .form-control input:focus+label span,
  .form-control input:valid+label span {
    color: #101010;
    transform: translateY(-30px);
  }`;

export default Input;
