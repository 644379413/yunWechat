<template>
    <div class="errtip" v-if="validation[field].invalid ">
        <span class="glyphicon glyphicon-remove"
              style="color:lightsalmon;line-height:2;"
              aria-hidden="true">
        </span>
        <label v-for="validator in validators"
               v-if="validation[field][validator]">
            {{validation[field][validator]}}
        </label>
        <em class="errtips_jiantou_em">&#9670;</em>
        <span class="errtips_jiantou_span">&#9670;</span>
    </div>
    <!--<div v-if="validation[field].valid && validation[field].touched" >-->
    <!--<span class="glyphicon glyphicon-ok"-->
    <!--style="color: lightgreen;line-height: 2">-->
    <!--</span>-->
    <!--</div>-->

</template>
<script>
    module.exports = {
        props: {
            name: {
                type: String,
                default: 'validation',
                required: true
            },
            field: {
                type: String,
                required: true
            },
            validators: {
                type: Array
            }
        },
        data: function () {
            var validation = this.$parent['$' + this.name];
            return {
                validation: validation
            }
        }
    }
</script>
<style>
    .errtip {
        margin: 0 auto;
        border: 1px solid #FA9150;
        padding: 0px 10px 0px 10px;
        background-color: #FEF1E9;
        line-height: 160%;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        position: absolute;
        border-radius: 5px;
        left: 100%;
        top: 2px;
        width: initial;
    }

    .errtips_jiantou_span {
        font-style: normal;
        font-size: 12px;
        position: absolute;
        left: -7px;
        top: 5px;
        color: #FA9150;
    }

    .errtips_jiantou_em {
        font-style: normal;
        font-size: 15px;
        position: absolute;
        left: -5px;
        top: 5px;
        color: #FEF1E9;
        z-index: 1;
    }
</style>