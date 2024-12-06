import { useState } from 'react';
import { Button, ButtonGroup } from "@nextui-org/react";

export default function SearchBar() {
    const [f, updateFilters] = useState([0, 0, 0, 0, 0, 0, 0])
    
    function handleClick(a: number) {
        if(a == 0) updateFilters(f => [(f[0] == 0 ? 1 : 0), f[1], f[2], f[3], f[4], f[5], f[6]]);
        else if(a == 1) updateFilters(f => [f[0], (f[1] == 0 ? 1 : 0), f[2], f[3], f[4], f[5], f[6]]);
        else if(a == 2) updateFilters(f => [f[0], f[1], (f[2] == 0 ? 1 : 0), f[3], f[4], f[5], f[6]]);
        else if(a == 3) updateFilters(f => [f[0], f[1], f[2], (f[3] == 0 ? 1 : 0), f[4], f[5], f[6]]);
        else if(a == 4) updateFilters(f => [f[0], f[1], f[2], f[3], (f[4] == 0 ? 1 : 0), f[5], f[6]]);
        else if(a == 5) updateFilters(f => [f[0], f[1], f[2], f[3], f[4], (f[5] == 0 ? 1 : 0), f[6]]);
        else if(a == 6) updateFilters(f => [f[0], f[1], f[2], f[3], f[4], f[5], (f[6] == 0 ? 1 : 0)]);
    }

    return (
    <ButtonGroup size="sm" >
        <Button onPress={e => handleClick(0)} variant={f[0] == 0 ? "faded" : "solid"}>
            Concerts
        </Button>
        <Button onPress={e => handleClick(1)} variant={f[1] == 0 ? "faded" : "solid"}>
            Movies
        </Button>
        <Button onPress={e => handleClick(2)} variant={f[2] == 0 ? "faded" : "solid"}>
            Plays
        </Button>
        <Button onPress={e => handleClick(3)} variant={f[3] == 0 ? "faded" : "solid"}>
            Athletics
        </Button>
        <Button onPress={e => handleClick(4)} variant={f[4] == 0 ? "faded" : "solid"}>
            Conferences
        </Button>
        <Button onPress={e => handleClick(5)} variant={f[5] == 0 ? "faded" : "solid"}>
            Conventions
        </Button>
        <Button onPress={e => handleClick(6)} variant={f[6] == 0 ? "faded" : "solid"}>
            Other
        </Button>
    </ButtonGroup>
  );
}

